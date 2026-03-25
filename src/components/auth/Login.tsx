// src/components/auth/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Добавили Link
import { useApp } from '../../context/AppContext';
import './Login.css';

const Login: React.FC = () => {
    const { login } = useApp();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'guest' // 'admin' или 'guest'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Передаем только email и password
        const result = await login(formData.email, formData.password);

        if (result.success && result.user) {
            // Определяем куда перенаправить на основе роли пользователя
            if (result.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/guest');
            }
        } else {
            setError(result.error || 'Ошибка входа');
        }

        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const fillDemoCredentials = (userType: 'admin' | 'guest') => {
        if (userType === 'admin') {
            setFormData({
                email: 'admin@itsolutions.com',
                password: 'admin123',
                userType: 'admin'
            });
        } else {
            setFormData({
                email: 'guest@example.com',
                password: 'guest123',
                userType: 'guest'
            });
        }
    };

    return (
        <div className="login-page">
            <div className="container">
                <div className="login-container">
                    <div className="login-card">
                        <div className="login-header">
                            <h2>Вход в систему</h2>
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={
                                        formData.userType === 'admin'
                                            ? 'admin@itsolutions.com'
                                            : 'guest@example.com'
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Пароль</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Введите пароль"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className="login-btn"
                                disabled={loading}
                            >
                                {loading ? 'Вход...' : 'Войти'}
                            </button>

                            {/* НОВОЕ: Ссылка на регистрацию */}
                            <div className="registration-link">
                                <p>
                                    Нет аккаунта?{' '}
                                    <Link to="/register" className="register-link">
                                        Зарегистрироваться
                                    </Link>
                                </p>
                            </div>

                            <div className="demo-section">
                                <div className="demo-buttons">
                                    <button
                                        type="button"
                                        className="demo-btn guest-demo"
                                        onClick={() => fillDemoCredentials('guest')}
                                    >
                                        Заполнить демо гостя
                                    </button>
                                    <button
                                        type="button"
                                        className="demo-btn admin-demo"
                                        onClick={() => fillDemoCredentials('admin')}
                                    >
                                        Заполнить демо админа
                                    </button>
                                </div>

                                <div className="demo-info">
                                    <div className="demo-role">
                                        <strong>Демо Гость:</strong><br />
                                        Email: guest@example.com<br />
                                        Пароль: guest123
                                    </div>
                                    <div className="demo-role">
                                        <strong>Демо Администратор:</strong><br />
                                        Email: admin@itsolutions.com<br />
                                        Пароль: admin123
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;