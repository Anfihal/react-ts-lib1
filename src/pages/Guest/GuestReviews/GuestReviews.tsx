import React, { useState, useCallback } from 'react';
import { useReviews } from '../../../context/ReviewsContext';
import './GuestReviews.css';

interface FormData {
    name: string;
    email: string;
    rating: number;
    review: string;
}

const GuestReviews = () => {
    const { addReview } = useReviews();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        rating: 0,
        review: '',
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // Переносим в props или получаем через config в реальном проекте
    const moderationEnabled = true;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRating = useCallback((rating: number) => {
        setFormData((prev) => ({ ...prev, rating }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await addReview({
                name: formData.name,
                email: formData.email,
                rating: formData.rating,
                text: formData.review,
            });
            setStatus('success');
            setFormData({ name: '', email: '', rating: 0, review: '' });
        } catch {
            setStatus('error');
        }
    };

    const getInitials = useCallback((name: string) => {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }, []);

    const resetForm = () => setStatus('idle');

    return (
        <div className="guest-reviews">
            <div className="card">
                <h2 className="guest-reviews__title">Поделитесь своим опытом</h2>

                {status === 'success' ? (
                    <div className="guest-reviews__success">
                        <div className="success-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <h3>Спасибо вам за ваш отзыв!</h3>
                        </div>
                        <p>
                            {moderationEnabled
                                ? 'Ваш отзыв будет опубликован после того, как наша команда его проверит.'
                                : 'Ваш отзыв опубликован!'}
                        </p>
                        <button className="btn-primary" onClick={resetForm}>
                            Оставьте еще один отзыв
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Имя *</label>
                            <input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                aria-required="true"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email (optional)</label>
                            <input id="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <div className="rating-stars" role="radiogroup" aria-required="true">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star ${formData.rating >= star ? 'active' : ''}`}
                                        onClick={() => handleRating(star)}
                                        aria-label={`Rate ${star} out of 5`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="review">Отзыв *</label>
                            <textarea
                                id="review"
                                name="review"
                                rows={4}
                                value={formData.review}
                                onChange={handleChange}
                                required
                                aria-required="true"
                            />
                        </div>

                        <div className="preview-section">
                            <h4>Предпросмотр</h4>
                            <div className="review-preview">
                                <div className="avatar-preview">{formData.name ? getInitials(formData.name) : '?'}</div>
                                <div className="preview-content">
                                    <div className="preview-header">
                                        <span>{formData.name || 'Ваше имя'}</span>
                                        <div className="rating-preview">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < formData.rating ? 'active' : ''}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p>{formData.review || 'Ваш отзыв...'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={status === 'submitting' || formData.rating === 0 || !formData.name || !formData.review}
                            >
                                {status === 'submitting' ? 'Публикуется...' : 'Отправить отзыв'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default GuestReviews;