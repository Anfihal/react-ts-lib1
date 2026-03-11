import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useReviews } from '../../context/ReviewsContext';
import type { Review } from '../../context/ReviewsContext';
import './Reviews.css';

const Reviews = () => {
    const { reviews } = useReviews();
    const [visibleReviews, setVisibleReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const reviewsPerPage = 6;

    const publishedReviews = useMemo(
        () => reviews.filter((r: Review) => r.status === 'published'),
        [reviews]
    );

    const prevPublishedReviewsRef = useRef(publishedReviews);

    useEffect(() => {
        if (prevPublishedReviewsRef.current !== publishedReviews) {
            setPage(1);
            prevPublishedReviewsRef.current = publishedReviews;
        }
    }, [publishedReviews]);

    useEffect(() => {
        if (page === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        const timer = setTimeout(() => {
            const startIndex = (page - 1) * reviewsPerPage;
            const endIndex = startIndex + reviewsPerPage;
            const newReviews = publishedReviews.slice(startIndex, endIndex);

            if (page === 1) {
                setVisibleReviews(newReviews);
                setLoading(false);
            } else {
                setVisibleReviews((prev) => [...prev, ...newReviews]);
                setLoadingMore(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [page, publishedReviews, reviewsPerPage]);

    const loadMore = useCallback(() => {
        setPage((prev) => prev + 1);
    }, []);

    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }, []);

    const getInitials = useCallback((name: string) => {
        if (!name.trim()) return '?';
        return name
            .split(' ')
            .filter((part) => part.length > 0)
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }, []);

    if (loading && page === 1) {
        return (
            <div className="reviews">
                <div className="reviews-header">
                    <h2>Отзывы клиентов</h2>
                    <p className="reviews-header__subtitle">
                        Реальные результаты от реальных клиентов — без лишних слов, только результат.
                    </p>
                </div>
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Загрузка отзывов...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reviews">
            <div className="reviews-header">
                <h2>Отзывы клиентов</h2>
                <p className="reviews-header__subtitle">
                    Реальные результаты от реальных клиентов — без лишних слов, только результат.
                </p>
            </div>

            {publishedReviews.length === 0 ? (
                <div className="no-reviews">
                    <p>Пока нет опубликованных отзывов.</p>
                </div>
            ) : (
                <>
                    <div className="reviews-grid">
                        {visibleReviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <div className="avatar">{getInitials(review.name)}</div>
                                    <div className="review-meta">
                                        <div className="review-name">
                                            {review.name}
                                            {review.verified && (
                                                <span className="verified-badge" aria-label="Проверенный клиент">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                        <polyline points="22 4 12 14.01 9 11.01" />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                        <div className="review-date">{formatDate(review.createdAt)}</div>
                                    </div>
                                </div>

                                <div className="rating">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < review.rating ? 'active' : ''} aria-hidden="true">
                                            ★
                                        </span>
                                    ))}
                                    <span className="sr-only">Рейтинг: {review.rating} из 5</span>
                                </div>

                                <p className="review-text">{review.text}</p>
                            </div>
                        ))}
                    </div>

                    {publishedReviews.length > visibleReviews.length && (
                        <div className="load-more">
                            <button className="btn-outline" onClick={loadMore} disabled={loadingMore}>
                                {loadingMore ? 'Загрузка...' : 'Загрузить еще отзывы'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Reviews;