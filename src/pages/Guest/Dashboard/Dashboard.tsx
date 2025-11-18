// src/pages/Guest/Dashboard/Dashboard.tsx
import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const stats = [
        { label: 'Мои проекты', value: '3', change: '+1 новый', icon: '💼' },
        { label: 'Активные заявки', value: '2', change: 'в работе', icon: '📝' },
        { label: 'Завершенные', value: '5', change: 'всего', icon: '✅' },
        { label: 'Баланс', value: '₽15,800', change: 'доступно', icon: '💰' }
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Добро пожаловать! 👋</h1>
                <p>Обзор вашей активности и проектов</p>
            </div>

            {/* Статистика */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-content">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                            <span className="stat-change">{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Основной контент */}
            <div className="dashboard-main">
                <div className="welcome-card">
                    <h2>🚀 Начните работу</h2>
                    <p>Это ваш личный кабинет. Здесь вы можете управлять проектами, отслеживать прогресс и взаимодействовать с нашей командой.</p>

                    <div className="welcome-actions">
                        <button className="btn-primary">Создать новый проект</button>
                        <button className="btn-secondary">Изучить возможности</button>
                    </div>
                </div>

                <div className="quick-stats">
                    <h3>📈 Быстрая статистика</h3>
                    <div className="stats-list">
                        <div className="stat-item">
                            <span className="stat-label">Проектов в работе</span>
                            <span className="stat-value">2</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Новых сообщений</span>
                            <span className="stat-value">3</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Предстоящих дедлайнов</span>
                            <span className="stat-value">1</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;