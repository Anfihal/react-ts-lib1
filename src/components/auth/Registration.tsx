// src/components/auth/Registration.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Registration.css';

const Registration: React.FC = () => {
    const { register } = useApp();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Валидация
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            setLoading(false);
            return;
        }

        try {
            const result = await register({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                phone: formData.phone
            });

            if (result.success) {
                setSuccess('Регистрация успешна! Теперь вы можете войти в систему.');
                // Очищаем форму
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    fullName: '',
                    phone: ''
                });
            } else {
                setError(result.error || 'Ошибка регистрации');
            }
        } catch (err) {
            setError('Произошла ошибка при регистрации');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const fillDemoData = () => {
        setFormData({
            email: 'user' + Math.floor(Math.random() * 1000) + '@example.com',
            password: 'user123',
            confirmPassword: 'user123',
            fullName: 'Иван Иванов',
            phone: '+7 (999) 123-45-67'
        });
    };

    return (
        <div className="registration-page">
            <div className="container">
                <div className="registration-container">
                    <div className="registration-card">
                        <div className="registration-header">
                            <h2>Регистрация пользователя</h2>
                            <p>Создайте аккаунт для доступа к личному кабинету</p>
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="success-message">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="registration-form">
                            <div className="form-group">
                                <label htmlFor="fullName">ФИО</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Иванов Иван Иванович"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@mail.com"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Телефон</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+7 (999) 123-45-67"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">Пароль</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Минимум 6 символов"
                                        minLength={6}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Подтверждение пароля</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Повторите пароль"
                                        minLength={6}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="register-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Регистрация...
                                    </>
                                ) : (
                                    'Зарегистрироваться'
                                )}
                            </button>

                            <div className="helper-buttons">
                                <button
                                    type="button"
                                    className="demo-fill-btn"
                                    onClick={fillDemoData}
                                    disabled={loading}
                                >
                                    Заполнить демо данные
                                </button>
                            </div>

                            <div className="registration-footer">
                                <p>
                                    Уже есть аккаунт?{' '}
                                    <Link to="/login" className="login-link">
                                        Войти
                                    </Link>
                                </p>
                                <small className="terms-note">
                                    Нажимая "Зарегистрироваться", вы соглашаетесь с условиями использования
                                </small>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;