// src/components/admin/users/UserManagement.tsx
import React from 'react';
import './UserManagement.css'; // ← подключаем свои стили

const UserManagement: React.FC = () => {
    return (
        <section className="users-section">
            <h2>Управление пользователями</h2>
            <p>Функционал управления пользователями будет добавлен в ближайшее время</p>
            <div className="users-stats">
                <div className="user-stat">
                    <h3>Всего пользователей</h3>
                    <span className="stat-number">157</span>
                </div>
                <div className="user-stat">
                    <h3>Активных</h3>
                    <span className="stat-number">142</span>
                </div>
                <div className="user-stat">
                    <h3>Новых за месяц</h3>
                    <span className="stat-number">12</span>
                </div>
            </div>
        </section>
    );
};

export default UserManagement;