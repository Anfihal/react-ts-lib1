// src/pages/Admin/Admin.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from '../../components/admin/Dashboard/Dashboard';
import ContactManagement from '../../components/admin/contact/ContactManagement';
import ServiceManagement from '../../components/admin/services/ServiceManagement';
import ProductManagement from '../../components/admin/products/ProductManagement';
import AboutManagement from '../../components/admin/about/AboutManagement';
import HomeManagement from '../../components/admin/home/HomeManagement'; // Добавлен импорт
import './Admin.css';

const Admin: React.FC = () => {
    const { state } = useApp();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'stats' | 'services' | 'products' | 'about' | 'users' | 'contact' | 'home'>('dashboard');
    const navigate = useNavigate();
    const location = useLocation();

    // Синхронизация активной вкладки с URL
    React.useEffect(() => {
        const path = location.pathname;
        if (path.includes('/admin/stats')) setActiveTab('stats');
        else if (path.includes('/admin/services')) setActiveTab('services');
        else if (path.includes('/admin/products')) setActiveTab('products');
        else if (path.includes('/admin/users')) setActiveTab('users');
        else if (path.includes('/admin/contact')) setActiveTab('contact');
        else if (path.includes('/admin/about')) setActiveTab('about');
        else if (path.includes('/admin/home')) setActiveTab('home');
        else setActiveTab('dashboard');
    }, [location]);

    const handleTabChange = (tab: 'dashboard' | 'stats' | 'services' | 'products' | 'about' | 'users' | 'contact' | 'home') => {
        setActiveTab(tab);
        if (tab === 'dashboard') {
            navigate('/admin');
        } else {
            navigate(`/admin/${tab}`);
        }
    };

    return (
        <div className="admin-page">
            {/* Шапка админ-панели */}
            <div className="admin-header">
                <h1>Панель администратора</h1>
                <p>Добро пожаловать, {state.user?.name}</p>

                <div className="admin-info">
                    <span>Email: {state.user?.email}</span>
                    <span>Роль: Администратор</span>
                    <span>Тема: {state.theme === 'light' ? 'Светлая' : 'Темная'}</span>
                </div>
            </div>

            {/* Навигационные вкладки */}
            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => handleTabChange('dashboard')}
                >
                    📊 Дашборд
                </button>
                <button
                    className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => handleTabChange('home')}
                >
                    🏠 Главная
                </button>
                <button
                    className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => handleTabChange('stats')}
                >
                    📈 Статистика
                </button>
                <button
                    className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
                    onClick={() => handleTabChange('services')}
                >
                    🛠️ Услуги
                </button>
                <button
                    className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => handleTabChange('products')}
                >
                    🛍️ Товары
                </button>
                <button
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => handleTabChange('users')}
                >
                    👥 Пользователи
                </button>
                <button
                    className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
                    onClick={() => handleTabChange('contact')}
                >
                    📞 Контакты
                </button>
                <button
                    className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                    onClick={() => handleTabChange('about')}
                >
                    ℹ️ О нас
                </button>
            </div>

            {/* Вложенные маршруты */}
            <div className="admin-content">
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="home" element={<HomeManagement />} />
                    <Route path="stats" element={
                        <section className="admin-stats">
                            <h2>Статистика системы</h2>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h3>156</h3>
                                    <p>Пользователи</p>
                                    <span className="stat-trend">↑ +12 за месяц</span>
                                </div>
                                <div className="stat-card">
                                    <h3>42</h3>
                                    <p>Активные проекты</p>
                                    <span className="stat-trend">↑ +5 за месяц</span>
                                </div>
                                <div className="stat-card">
                                    <h3>₽1,240,500</h3>
                                    <p>Общий доход</p>
                                    <span className="stat-trend">↑ +15%</span>
                                </div>
                                <div className="stat-card">
                                    <h3>94%</h3>
                                    <p>Удовлетворенность</p>
                                    <span className="stat-trend">→ Стабильно</span>
                                </div>
                            </div>
                        </section>
                    } />
                    <Route path="services" element={<ServiceManagement />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="about" element={<AboutManagement />} />
                    <Route path="users" element={
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
                    } />
                    <Route path="contact" element={<ContactManagement />} />
                </Routes>
            </div>
        </div>
    );
};

export default Admin;