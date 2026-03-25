// src / components / admin / profile / AdminProfile.tsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useProfile } from '../../../context/ProfileContext';
import type { ProfileData } from '../../../context/ProfileContext';
import './AdminProfile.css';

const AdminProfile: React.FC = () => {
    const { state: appState } = useApp();
    const { state: profileState, updateProfile, fetchProfile, toggleEditing } = useProfile();
    const [formData, setFormData] = useState<Partial<ProfileData>>({});

    useEffect(() => {
        if (appState.user?.id) {
            // Преобразуем ID в строку, если это число
            const userId = appState.user.id.toString();
            fetchProfile(userId);
        }
    }, [appState.user?.id, fetchProfile]);

    useEffect(() => {
        if (profileState.profile) {
            setFormData(profileState.profile);
        }
    }, [profileState.profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSave = async () => {
        await updateProfile(formData);
    };

    const handleCancel = () => {
        setFormData(profileState.profile || {});
        toggleEditing();
    };

    if (profileState.isLoading && !profileState.profile) {
        return (
            <div className="admin-profile loading">
                <div className="loading-spinner">Загрузка профиля...</div>
            </div>
        );
    }

    return (
        <div className="admin-profile">
            <div className="profile-header">
                <h1>👑 Профиль администратора</h1>
                <p>Управление вашими личными данными и настройками</p>
            </div>

            {profileState.error && (
                <div className="error-message">
                    ❌ {profileState.error}
                </div>
            )}

            <div className="profile-content">
                <div className="profile-card">
                    <div className="card-header">
                        <h2>📊 Основная информация</h2>
                        {!profileState.isEditing && (
                            <button
                                className="edit-btn"
                                onClick={toggleEditing}
                                disabled={profileState.isLoading}
                            >
                                {profileState.isLoading ? '⏳ Загрузка...' : '✏️ Редактировать'}
                            </button>
                        )}
                    </div>

                    <div className="profile-info">
                        <div className="avatar-section">
                            <div className="profile-avatar">
                                {profileState.profile?.avatar ? (
                                    <img
                                        src={profileState.profile.avatar}
                                        alt={profileState.profile.name}
                                        className="avatar-large"
                                    />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {profileState.profile?.name?.charAt(0)?.toUpperCase() || 'A'}
                                    </div>
                                )}
                            </div>
                            {profileState.isEditing && (
                                <button className="change-avatar-btn">
                                    📷 Сменить фото
                                </button>
                            )}
                        </div>

                        <div className="info-fields">
                            <div className="field-group">
                                <label>👤 Имя</label>
                                {profileState.isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        placeholder="Введите ваше имя"
                                    />
                                ) : (
                                    <div className="field-value">{profileState.profile?.name || 'Не указано'}</div>
                                )}
                            </div>

                            <div className="field-group">
                                <label>📧 Email</label>
                                {profileState.isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        placeholder="Введите ваш email"
                                    />
                                ) : (
                                    <div className="field-value">{profileState.profile?.email || 'Не указан'}</div>
                                )}
                            </div>

                            <div className="field-group">
                                <label>📞 Телефон</label>
                                {profileState.isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleInputChange}
                                        placeholder="Введите ваш телефон"
                                    />
                                ) : (
                                    <div className="field-value">{profileState.profile?.phone || 'Не указан'}</div>
                                )}
                            </div>

                            <div className="field-group">
                                <label>💼 Должность</label>
                                {profileState.isEditing ? (
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position || ''}
                                        onChange={handleInputChange}
                                        placeholder="Введите вашу должность"
                                    />
                                ) : (
                                    <div className="field-value">{profileState.profile?.position || 'Администратор'}</div>
                                )}
                            </div>

                            <div className="field-group">
                                <label>📝 О себе</label>
                                {profileState.isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={formData.bio || ''}
                                        onChange={handleInputChange}
                                        placeholder="Расскажите о себе..."
                                        rows={4}
                                    />
                                ) : (
                                    <div className="field-value bio-value">
                                        {profileState.profile?.bio || 'Информация не добавлена'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {profileState.isEditing && (
                        <div className="action-buttons">
                            <button
                                className="save-btn"
                                onClick={handleSave}
                                disabled={profileState.isLoading}
                            >
                                {profileState.isLoading ? '⏳ Сохранение...' : '💾 Сохранить изменения'}
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={handleCancel}
                                disabled={profileState.isLoading}
                            >
                                ❌ Отменить
                            </button>
                        </div>
                    )}
                </div>

                <div className="profile-sidebar">
                    <div className="stats-cards">
                        <div className="stat-card">
                            <div className="stat-icon">🛠️</div>
                            <div className="stat-info">
                                <div className="stat-number">156</div>
                                <div className="stat-label">Выполненных задач</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-info">
                                <div className="stat-number">42</div>
                                <div className="stat-label">Пользователей</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">📦</div>
                            <div className="stat-info">
                                <div className="stat-number">89</div>
                                <div className="stat-label">Заказов обработано</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">⭐</div>
                            <div className="stat-info">
                                <div className="stat-number">4.8</div>
                                <div className="stat-label">Рейтинг активности</div>
                            </div>
                        </div>
                    </div>

                    <div className="settings-card">
                        <h3>⚙️ Настройки</h3>
                        <div className="setting-item">
                            <label>Уведомления</label>
                            <input
                                type="checkbox"
                                name="notifications"
                                checked={formData.notifications || false}
                                onChange={handleInputChange}
                                disabled={!profileState.isEditing}
                            />
                        </div>
                        <div className="setting-item">
                            <label>Язык</label>
                            <select
                                name="language"
                                value={formData.language || 'ru'}
                                onChange={handleInputChange}
                                disabled={!profileState.isEditing}
                            >
                                <option value="ru">Русский</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;