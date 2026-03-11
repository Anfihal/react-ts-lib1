import React, { useState } from 'react';
import { useReviews } from '../../../context/ReviewsContext';
import type { Review } from '../../../context/ReviewsContext';
import './AdminReviews.css';

const AdminReviews = () => {
    const { reviews, updateReview, deleteReview } = useReviews();
    const [filters, setFilters] = useState({
        status: 'all',
        rating: 'all',
        search: ''
    });
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        rating: 0,
        text: '',
        status: 'pending' as 'pending' | 'published' | 'hidden'
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleAction = (id: string, action: 'approve' | 'hide' | 'delete') => {
        if (action === 'delete') {
            if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
                deleteReview(id);
            }
        } else if (action === 'approve') {
            updateReview(id, { status: 'published' });
        } else if (action === 'hide') {
            updateReview(id, { status: 'hidden' });
        }
    };

    const openEditModal = (review: Review) => {
        setEditingReview(review);
        setEditForm({
            name: review.name,
            email: review.email || '',
            rating: review.rating,
            text: review.text,
            status: review.status
        });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingReview) {
            updateReview(editingReview.id, {
                name: editForm.name,
                email: editForm.email,
                rating: editForm.rating,
                text: editForm.text,
                status: editForm.status
            });
            setEditingReview(null);
        }
    };

    const filteredReviews = reviews.filter(review => {
        const matchesStatus = filters.status === 'all' || review.status === filters.status;
        const matchesRating = filters.rating === 'all' ||
            (filters.rating === '5' && review.rating === 5) ||
            (filters.rating === '4' && review.rating >= 4) ||
            (filters.rating === '3' && review.rating >= 3) ||
            (filters.rating === '2' && review.rating <= 2);
        const matchesSearch = !filters.search ||
            review.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            (review.email && review.email.toLowerCase().includes(filters.search.toLowerCase())) ||
            review.text.toLowerCase().includes(filters.search.toLowerCase());

        return matchesStatus && matchesRating && matchesSearch;
    });

    return (
        <div className="admin-reviews">
            <div className="admin-header">
                <h2>Управление отзывами</h2>
                <div className="filters">
                    <div className="filter-group">
                        <label htmlFor="status-filter">Статус</label>
                        <select
                            id="status-filter"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="all">Все статусы</option>
                            <option value="pending">На рассмотрении</option>
                            <option value="published">Опубликовано</option>
                            <option value="hidden">Скрыто</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="rating-filter">Рейтинг</label>
                        <select
                            id="rating-filter"
                            name="rating"
                            value={filters.rating}
                            onChange={handleFilterChange}
                        >
                            <option value="all">Все рейтинги</option>
                            <option value="5">5 звезд</option>
                            <option value="4">4+ звезды</option>
                            <option value="3">3+ звезды</option>
                            <option value="2">2 звезды или меньше</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="search-filter">Поиск</label>
                        <input
                            type="text"
                            id="search-filter"
                            name="search"
                            placeholder="Поиск отзывов..."
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
            </div>

            <div className="reviews-table">
                <div className="table-header">
                    <div className="table-row">
                        <div className="table-cell header">Автор</div>
                        <div className="table-cell header hidden-mobile">Email</div>
                        <div className="table-cell header">Рейтинг</div>
                        <div className="table-cell header">Статус</div>
                        <div className="table-cell header">Дата</div>
                        <div className="table-cell header">Действия</div>
                    </div>
                </div>

                <div className="table-body">
                    {filteredReviews.map((review) => (
                        <div
                            key={review.id}
                            className={`table-row ${review.new ? 'new-review' : ''}`}
                        >
                            <div className="table-cell">
                                <div className="flex items-center gap-2">
                                    <div className="avatar">
                                        {review.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span>{review.name}</span>
                                </div>
                            </div>

                            <div className="table-cell hidden-mobile">
                                {review.email || '-'}
                            </div>

                            <div className="table-cell">
                                <div className="rating">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < review.rating ? 'active' : ''}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="table-cell">
                                <span className={`status-badge ${review.status}`}>
                                    {review.status === 'pending' ? 'На рассмотрении' :
                                        review.status === 'published' ? 'Опубликовано' : 'Скрыто'}
                                </span>
                            </div>

                            <div className="table-cell">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </div>

                            <div className="table-cell actions">
                                <div className="flex gap-1">
                                    <button
                                        className="btn-outline"
                                        onClick={() => handleAction(review.id, 'approve')}
                                        disabled={review.status === 'published'}
                                    >
                                        Одобрить
                                    </button>
                                    <button
                                        className="btn-outline"
                                        onClick={() => handleAction(review.id, 'hide')}
                                        disabled={review.status === 'hidden'}
                                    >
                                        Скрыть
                                    </button>
                                    <button
                                        className="btn-primary"
                                        onClick={() => openEditModal(review)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn-danger"
                                        onClick={() => handleAction(review.id, 'delete')}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {editingReview && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Редактировать отзыв</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label>Имя</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Рейтинг</label>
                                <select
                                    name="rating"
                                    value={editForm.rating}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                                >
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <option key={rating} value={rating}>{rating} звезд</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Статус</label>
                                <select
                                    name="status"
                                    value={editForm.status}
                                    onChange={handleEditChange}
                                >
                                    <option value="pending">На рассмотрении</option>
                                    <option value="published">Опубликовано</option>
                                    <option value="hidden">Скрыто</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Текст отзыва</label>
                                <textarea
                                    name="text"
                                    value={editForm.text}
                                    onChange={handleEditChange}
                                    rows={4}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-outline" onClick={() => setEditingReview(null)}>
                                    Отмена
                                </button>
                                <button type="submit" className="btn-primary">
                                    Сохранить изменения
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;