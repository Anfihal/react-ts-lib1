// src/pages/Guest/GuestProfile/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import type { User } from '../../../types';
import './Profile.css';

const Profile: React.FC = () => {
    const { state, dispatch } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Загрузка профиля при монтировании
    useEffect(() => {
        if (state.user) {
            setName(state.user.name || '');
            setEmail(state.user.email || '');
            setPhone(state.user.phone || '');
            setBio(state.user.bio || '');
        }
        setIsLoading(false);
    }, [state.user]);

    const handleSave = () => {
        if (state.user) {
            // Обновляем пользователя в контексте
            const updatedUser = {
                ...state.user,
                name: name.trim() || state.user.name,
                email: email.trim() || state.user.email,
                phone: phone.trim() || state.user.phone,
                bio: bio.trim() || state.user.bio,
            };

            // Обновляем в localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Обновляем зарегистрированных пользователей
            const savedUsers = localStorage.getItem('registeredUsers');
            if (savedUsers) {
                try {
                    const registeredUsers: Array<User & { password: string }> = JSON.parse(savedUsers);
                    const updatedRegisteredUsers = registeredUsers.map((u: any) =>
                        u.id === state.user?.id ? {
                            ...u,
                            name: updatedUser.name,
                            email: updatedUser.email,
                            phone: updatedUser.phone,
                            bio: updatedUser.bio,
                        } : u
                    );
                    localStorage.setItem('registeredUsers', JSON.stringify(updatedRegisteredUsers));
                } catch (error) {
                    console.error('Error updating registered users:', error);
                }
            }

            // Диспатчим обновление
            dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });

            setIsEditing(false);
            console.log('Профиль сохранен');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Восстановление данных из state.user при отмене
        if (state.user) {
            setName(state.user.name || '');
            setEmail(state.user.email || '');
            setPhone(state.user.phone || '');
            setBio(state.user.bio || '');
        }
    };

    // Функция для проверки заполненности профиля
    const isProfileEmpty = () => {
        return !name && !email && !phone && !bio;
    };

    if (isLoading) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="loading">Загрузка...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <h1>Профиль пользователя</h1>
                    {!isEditing && !isProfileEmpty() && (
                        <div className="profile-status">
                            Данные сохранены
                        </div>
                    )}
                </div>

                <div className="profile-card">
                    <div className="profile-avatar-section">
                        {!isEditing && (
                            <button
                                className="edit-btn primary"
                                onClick={() => setIsEditing(true)}
                            >
                                {isProfileEmpty() ? 'Создать профиль' : 'Редактировать профиль'}
                            </button>
                        )}
                    </div>

                    <div className="profile-info">
                        {isEditing ? (
                            <div className="edit-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Имя и фамилия *</label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Введите ваше имя"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email адрес *</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="phone">Телефон</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+7 (999) 999-99-99"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="bio">О себе</label>
                                    <textarea
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={4}
                                        placeholder="Расскажите о себе..."
                                        maxLength={500}
                                    />
                                    <div className="char-count">
                                        {bio.length}/500 символов
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button className="save-btn primary" onClick={handleSave}>
                                        Сохранить изменения
                                    </button>
                                    <button className="cancel-btn secondary" onClick={handleCancel} type="button">
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="view-mode">
                                {isProfileEmpty() ? (
                                    <div className="empty-profile">
                                        <h3>Профиль пока пуст</h3>
                                        <p>Нажмите "Создать профиль", чтобы добавить информацию о себе</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="info-grid">
                                            {name && (
                                                <div className="info-item">
                                                    <span className="label">Имя:</span>
                                                    <span className="value">{name}</span>
                                                </div>
                                            )}
                                            {email && (
                                                <div className="info-item">
                                                    <span className="label">Email:</span>
                                                    <span className="value">{email}</span>
                                                </div>
                                            )}
                                            {phone && (
                                                <div className="info-item">
                                                    <span className="label">Телефон:</span>
                                                    <span className="value">{phone}</span>
                                                </div>
                                            )}
                                        </div>
                                        {bio && (
                                            <div className="bio-section">
                                                <h3>О себе</h3>
                                                <p className="bio-text">{bio}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Информация о сохранении */}
                <div className="save-info">
                    <p>Все изменения сохраняются в вашем профиле</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;