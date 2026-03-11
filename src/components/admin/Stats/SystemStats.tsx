// src/components/admin/Stats/SystemStats.tsx
// src/components/admin/Stats/SystemStats.tsx
import React from 'react';
import './SystemStats.css';

const SystemStats: React.FC = () => {
    return (
        <section className="admin-stats">
            <h2>Статистика системы</h2>
            <div className="stats-grid">
                {/* === ПОЛЬЗОВАТЕЛИ === */}
                <div className="stat-card">
                    <h3>1 842</h3>
                    <p>Всего пользователей</p>
                    <span className="stat-trend positive">↑ +42 за неделю</span>
                </div>

                <div className="stat-card">
                    <h3>1 204</h3>
                    <p>Активных (30 дн.)</p>
                    <span className="stat-trend positive">↑ +18%</span>
                </div>

                <div className="stat-card">
                    <h3>94%</h3>
                    <p>Удержание</p>
                    <span className="stat-trend stable">→ Стабильно</span>
                </div>

                {/* === ФИНАНСЫ === */}
                <div className="stat-card">
                    <h3>₽528 400</h3>
                    <p>Доход (месяц)</p>
                    <span className="stat-trend positive">↑ +12%</span>
                </div>

                <div className="stat-card">
                    <h3>₽2 870</h3>
                    <p>Средний чек</p>
                    <span className="stat-trend negative">↓ -3%</span>
                </div>

                <div className="stat-card">
                    <h3>68</h3>
                    <p>Платящих</p>
                    <span className="stat-trend positive">↑ +5</span>
                </div>

                {/* === КОНТЕНТ === */}
                <div className="stat-card">
                    <h3>142</h3>
                    <p>Активных проектов</p>
                    <span className="stat-trend positive">↑ +7</span>
                </div>

                <div className="stat-card">
                    <h3>24</h3>
                    <p>Новых заявок</p>
                    <span className="stat-trend positive">↑ +9 за день</span>
                </div>

                {/* === ОБРАТНАЯ СВЯЗЬ === */}
                <div className="stat-card">
                    <h3>4.8</h3>
                    <p>Рейтинг (NPS)</p>
                    <span className="stat-trend positive">↑ +0.2</span>
                </div>

                <div className="stat-card">
                    <h3>92%</h3>
                    <p>Удовлетворённость</p>
                    <span className="stat-trend stable">→ Без изменений</span>
                </div>
            </div>
        </section>
    );
};

export default SystemStats;