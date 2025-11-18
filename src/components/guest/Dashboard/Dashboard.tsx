// src/components/guest/Dashboard/Dashboard.tsx
import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const stats = [
        { label: 'Мои проекты', value: '3', change: '+1 новый', icon: '💼' },
        { label: 'Активные заявки', value: '2', change: 'в работе', icon: '📝' },
        { label: 'Завершенные', value: '5', change: 'всего', icon: '✅' },
        { label: 'Баланс', value: '₽15,800', change: 'доступно', icon: '💰' }
    ];

    const recentProjects = [
        { name: 'Корпоративный сайт', status: 'В разработке', progress: 75, deadline: '15.12.2024' },
        { name: 'Мобильное приложение', status: 'На утверждении', progress: 90, deadline: '20.12.2024' },
        { name: 'Интернет-магазин', status: 'Завершен', progress: 100, deadline: '05.11.2024' }
    ];

    const quickActions = [
        { label: 'Создать заявку', icon: '➕', description: 'Новый проект' },
        { label: 'Оплатить счет', icon: '💳', description: 'Онлайн оплата' },
        { label: 'Скачать отчет', icon: '📊', description: 'По проектам' },
        { label: 'Связаться с поддержкой', icon: '💬', description: 'Помощь 24/7' }
    ];

    return (
        <div className="guest-dashboard">
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
            <div className="dashboard-content-grid">
                {/* Текущие проекты */}
                <div className="projects-card">
                    <h2>Текущие проекты</h2>
                    <div className="projects-list">
                        {recentProjects.map((project, index) => (
                            <div key={index} className="project-item">
                                <div className="project-info">
                                    <h4>{project.name}</h4>
                                    <span className={`project-status ${project.status.toLowerCase().includes('завершен') ? 'completed' : 'in-progress'}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="project-progress">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{project.progress}%</span>
                                </div>
                                <div className="project-deadline">
                                    До: {project.deadline}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Быстрые действия */}
                <div className="quick-actions-card">
                    <h2>Быстрые действия</h2>
                    <div className="actions-grid">
                        {quickActions.map((action, index) => (
                            <button key={index} className="action-btn">
                                <span className="action-icon">{action.icon}</span>
                                <div className="action-text">
                                    <strong>{action.label}</strong>
                                    <span>{action.description}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Последние уведомления */}
                <div className="notifications-card">
                    <h2>Последние уведомления</h2>
                    <div className="notifications-list">
                        <div className="notification-item">
                            <span className="notification-icon">📋</span>
                            <div className="notification-content">
                                <strong>Заявка одобрена</strong>
                                <span>Ваша заявка на разработку мобильного приложения была одобрена</span>
                                <span className="notification-time">2 часа назад</span>
                            </div>
                        </div>
                        <div className="notification-item">
                            <span className="notification-icon">💬</span>
                            <div className="notification-content">
                                <strong>Новое сообщение</strong>
                                <span>Менеджер проекта оставил комментарий</span>
                                <span className="notification-time">5 часов назад</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;