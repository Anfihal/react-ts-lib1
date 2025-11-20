// src/components/admin/home/HomeManagement.tsx
import React, { useState, useEffect } from 'react';
import { useHome } from '../../../context/HomeContext';
import type { HomeUpdateRequest } from '../../../types/HomeTypes';
import './HomeManagement.css';

const HomeManagement: React.FC = () => {
    const { state, updateHomeContent, setEditing } = useHome();
    const [formData, setFormData] = useState({
        heroTitle: '',
        heroSubtitle: '',
        videoUrl: '',
        videoPoster: '',
        primaryButtonText: '',
        secondaryButtonText: '',
        primaryButtonIcon: ''
    });

    useEffect(() => {
        if (state.homeContent) {
            setFormData({
                heroTitle: state.homeContent.heroTitle,
                heroSubtitle: state.homeContent.heroSubtitle,
                videoUrl: state.homeContent.videoUrl,
                videoPoster: state.homeContent.videoPoster,
                primaryButtonText: state.homeContent.primaryButtonText,
                secondaryButtonText: state.homeContent.secondaryButtonText,
                primaryButtonIcon: state.homeContent.primaryButtonIcon
            });
        }
    }, [state.homeContent]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!state.homeContent) return;

        const updateData: HomeUpdateRequest = {
            heroTitle: formData.heroTitle,
            heroSubtitle: formData.heroSubtitle,
            videoUrl: formData.videoUrl,
            videoPoster: formData.videoPoster,
            primaryButtonText: formData.primaryButtonText,
            secondaryButtonText: formData.secondaryButtonText,
            primaryButtonIcon: formData.primaryButtonIcon
        };

        await updateHomeContent(updateData);
    };

    const handleCancel = () => {
        setEditing(false);
        if (state.homeContent) {
            setFormData({
                heroTitle: state.homeContent.heroTitle,
                heroSubtitle: state.homeContent.heroSubtitle,
                videoUrl: state.homeContent.videoUrl,
                videoPoster: state.homeContent.videoPoster,
                primaryButtonText: state.homeContent.primaryButtonText,
                secondaryButtonText: state.homeContent.secondaryButtonText,
                primaryButtonIcon: state.homeContent.primaryButtonIcon
            });
        }
    };

    if (!state.homeContent) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="home-management">
            <div className="home-management-header">
                <h2>Управление главной страницей</h2>
                <div className="header-actions">
                    {!state.isEditing && (
                        <button
                            className="edit-btn"
                            onClick={() => setEditing(true)}
                        >
                            ✏️ Редактировать
                        </button>
                    )}
                </div>
            </div>

            {state.error && (
                <div className="error-message">
                    ❌ {state.error}
                </div>
            )}

            {state.isEditing ? (
                <form className="home-management-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Основной контент</h3>
                        <div className="form-group">
                            <label htmlFor="heroTitle">Заголовок *</label>
                            <input
                                type="text"
                                id="heroTitle"
                                value={formData.heroTitle}
                                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                required
                                disabled={state.isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="heroSubtitle">Подзаголовок *</label>
                            <textarea
                                id="heroSubtitle"
                                value={formData.heroSubtitle}
                                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                required
                                disabled={state.isLoading}
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Видео фон</h3>
                        <div className="form-group">
                            <label htmlFor="videoUrl">URL видео *</label>
                            <input
                                type="url"
                                id="videoUrl"
                                value={formData.videoUrl}
                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                required
                                disabled={state.isLoading}
                                placeholder="/videos/hero-background.mp4"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="videoPoster">Постер видео *</label>
                            <input
                                type="url"
                                id="videoPoster"
                                value={formData.videoPoster}
                                onChange={(e) => setFormData({ ...formData, videoPoster: e.target.value })}
                                required
                                disabled={state.isLoading}
                                placeholder="/images/video-poster.jpg"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Кнопки</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="primaryButtonText">Текст основной кнопки *</label>
                                <input
                                    type="text"
                                    id="primaryButtonText"
                                    value={formData.primaryButtonText}
                                    onChange={(e) => setFormData({ ...formData, primaryButtonText: e.target.value })}
                                    required
                                    disabled={state.isLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="primaryButtonIcon">Иконка основной кнопки</label>
                                <input
                                    type="text"
                                    id="primaryButtonIcon"
                                    value={formData.primaryButtonIcon}
                                    onChange={(e) => setFormData({ ...formData, primaryButtonIcon: e.target.value })}
                                    disabled={state.isLoading}
                                    placeholder="🚀"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="secondaryButtonText">Текст второй кнопки *</label>
                                <input
                                    type="text"
                                    id="secondaryButtonText"
                                    value={formData.secondaryButtonText}
                                    onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })}
                                    required
                                    disabled={state.isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={state.isLoading}
                        >
                            {state.isLoading ? 'Сохранение...' : '💾 Сохранить изменения'}
                        </button>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleCancel}
                            disabled={state.isLoading}
                        >
                            ❌ Отмена
                        </button>
                    </div>
                </form>
            ) : (
                <div className="home-preview">
                    <div className="preview-section">
                        <h3>Предпросмотр основной информации</h3>
                        <div className="preview-content">
                            <h4>{state.homeContent.heroTitle}</h4>
                            <p><strong>Подзаголовок:</strong> {state.homeContent.heroSubtitle}</p>
                            <p><strong>Основная кнопка:</strong> {state.homeContent.primaryButtonText} {state.homeContent.primaryButtonIcon}</p>
                            <p><strong>Вторая кнопка:</strong> {state.homeContent.secondaryButtonText}</p>
                            <p><strong>Видео:</strong> {state.homeContent.videoUrl}</p>
                            <p><strong>Постер:</strong> {state.homeContent.videoPoster}</p>
                        </div>
                    </div>

                    <div className="last-updated">
                        Последнее обновление: {state.homeContent.updatedAt.toLocaleString('ru-RU')}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeManagement;