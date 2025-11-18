import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const stats = [
        { label: 'Всего пользователей', value: '1,234', change: '+12%', icon: '👥' },
        { label: 'Активных проектов', value: '56', change: '+5%', icon: '💼' },
        { label: 'Новых заявок', value: '23', change: '+18%', icon: '📝' },
        { label: 'Доход', value: '₽248,900', change: '+8%', icon: '💰' }
    ];

    const recentActivities = [
        { user: 'Иван Петров', action: 'создал новый проект', time: '5 мин назад' },
        { user: 'Мария Сидорова', action: 'обновила профиль', time: '1 час назад' },
        { user: 'Алексей Козлов', action: 'оставил заявку', time: '2 часа назад' },
        { user: 'Елена Новикова', action: 'завершила проект', time: '3 часа назад' }
    ];

    return (
        <div className="dashboard">
            {/* Заголовок дашборда */}
            <div className="dashboard-header">
                <h1>Панель управления</h1>
            </div>

            {/* Статистика */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-content">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                            <span className="stat-change positive">{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Основной контент */}
            <div className="dashboard-content">
                <div className="activity-card">
                    <h2>Последняя активность</h2>
                    <div className="activity-list">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-avatar">
                                    {activity.user.charAt(0)}
                                </div>
                                <div className="activity-details">
                                    <strong>{activity.user}</strong> {activity.action}
                                    <span className="activity-time">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="quick-actions-card">
                    <h2>Быстрые действия</h2>
                    <div className="actions-grid">
                        <button className="action-btn">
                            <span className="action-icon">➕</span>
                            <span>Добавить пользователя</span>
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">📊</span>
                            <span>Создать отчет</span>
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">⚙️</span>
                            <span>Настройки системы</span>
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">📧</span>
                            <span>Рассылка</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;