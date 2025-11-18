import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Header.css';

interface NavigationLink {
    to: string;
    label: string;
}

const Header: React.FC = () => {
    const { state, logout, dispatch } = useApp();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Определяем текущую зону
    const isAdminArea = location.pathname.startsWith('/admin');
    const isGuestArea = location.pathname.startsWith('/guest');
    const isLoginPage = location.pathname === '/login';

    const toggleTheme = (): void => {
        dispatch({ type: 'TOGGLE_THEME' });
    };

    const toggleMenu = (): void => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = (): void => {
        logout();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const toggleUserMenu = (): void => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    // Автоматический переход в гостевую зону после авторизации (только для гостей)
    useEffect(() => {
        if (state.isAuthenticated && !state.isAdmin && !isGuestArea && !isAdminArea && !isLoginPage) {
            // Если пользователь авторизован как гость и находится в основной зоне,
            // перенаправляем его в гостевую зону
            const targetPath = '/guest';

            // Проверяем, что мы еще не на целевой странице
            if (location.pathname !== targetPath) {
                navigate(targetPath);
            }
        }
    }, [state.isAuthenticated, state.isAdmin, isAdminArea, isGuestArea, isLoginPage, location.pathname, navigate]);

    // Закрытие меню при клике вне его
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Навигация для разных зон
    const getNavigationLinks = (): NavigationLink[] => {
        // Админская зона - оставляем как было
        if (isAdminArea) {
            return [
                { to: "/admin", label: "📊 Панель управления" },
                { to: "/services", label: "🛍️ Услуги" },
                { to: "/shop", label: "🛍️ Магазин" },
                { to: "/about", label: "📧 О нас" },
            ];
        }

        // Зона личного кабинета гостя
        if (isGuestArea) {
            return [
                { to: "/guest/Dashboard", label: "📊 Обзор" },
                { to: "/guest/guestprofile", label: "👤 Профиль" },
                { to: "/guest/guestorders", label: "📦 Мои заказы" },
                { to: "/guest/guestservices", label: "🛍️ Услуги" },
                { to: "/guest/guestshop", label: "🛍️ Магазин" },
                { to: "/guest/cart", label: "🛒 Корзина" },
                { to: "/guest/guestabout", label: "📧 О нас" },
                { to: "/guest/guestcontact", label: "📞 Контакты" }
            ];
        }

        // Основной сайт
        const mainLinks: NavigationLink[] = [
            { to: "/", label: "Главная" },
            { to: "/services", label: "Услуги" },
            { to: "/shop", label: "Магазин" },
            { to: "/about", label: "О нас" },
            { to: "/contact", label: "Контакты" }
        ];

        // Добавляем ссылки на панели для авторизованных пользователей
        if (state.isAuthenticated) {
            if (state.isAdmin) {
                mainLinks.push({ to: "/admin", label: "🛠️ Админ" });
            } else {
                mainLinks.push({ to: "/guest", label: "📊 Кабинет" });
            }
        }

        return mainLinks;
    };

    // Ссылка для дашборда в меню пользователя
    const getDashboardLink = (): string => {
        return state.isAdmin ? '/admin' : '/guest';
    };

    // Ссылка для профиля в меню пользователя
    const getProfileLink = (): string => {
        return state.isAdmin ? '/admin/profile' : '/guest/guestprofile';
    };

    // Текст для дашборда в меню пользователя
    const getDashboardLabel = (): string => {
        return state.isAdmin ? '🛠️ Панель управления' : '📊 Личный кабинет';
    };

    // Текст для профиля в меню пользователя
    const getProfileLabel = (): string => {
        return state.isAdmin ? '👑 Профиль администратора' : '👤 Профиль';
    };

    // Роль пользователя для отображения
    const getUserRole = (): string => {
        return state.isAdmin ? '👑 Администратор' : '👤 Пользователь';
    };

    // Обработчик клика по логотипу
    const handleLogoClick = (e: React.MouseEvent) => {
        if (state.isAuthenticated && !state.isAdmin) {
            // Для гостя - перенаправляем в гостевую зону
            e.preventDefault();
            navigate('/guest');
        }
        // Для админа и неавторизованных оставляем стандартное поведение
    };

    return (
        <header className={`header ${isAdminArea ? 'admin-header' : ''} ${isGuestArea ? 'guest-header' : ''}`}>
            <div className="container">
                <div className="header-content">
                    {/* Логотип */}
                    <Link
                        to={state.isAuthenticated && !state.isAdmin ? '/guest' : '/'}
                        className="logo"
                        onClick={handleLogoClick}
                    >
                        <img
                            alt='IT Solutions'
                            className="logo-image"
                            src={state.theme === 'dark' ? "/images/logo/logo.png" : "/images/logo/logo-white.png"}
                        />
                    </Link>

                    {/* Навигация */}
                    <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                        {getNavigationLinks().map((link: NavigationLink) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Правая часть */}
                    <div className="header-actions">
                        {/* Блок авторизации */}
                        {state.isAuthenticated ? (
                            <div className="user-menu" ref={userMenuRef}>
                                <button
                                    className="user-btn"
                                    onClick={toggleUserMenu}
                                    aria-label="Открыть меню пользователя"
                                    type="button"
                                >
                                    <span className="user-avatar">
                                        {state.user?.avatar ? (
                                            <img
                                                src={state.user.avatar}
                                                alt={state.user.name || 'User'}
                                                className="avatar-image"
                                            />
                                        ) : (
                                            state.user?.name?.charAt(0)?.toUpperCase() || 'U'
                                        )}
                                    </span>
                                    <span className="user-name">
                                        {state.user?.name || 'User'}
                                    </span>
                                    <span className={`dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`}>
                                        ▼
                                    </span>
                                </button>

                                {isUserMenuOpen && (
                                    <div className="user-dropdown">
                                        <div className="user-info">
                                            <strong>{state.user?.name || 'User'}</strong>
                                            <span>{state.user?.email || 'No email'}</span>
                                            <span className="user-role">
                                                {getUserRole()}
                                            </span>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link
                                            to={getDashboardLink()}
                                            className="dropdown-item"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            {getDashboardLabel()}
                                        </Link>
                                        <Link
                                            to={getProfileLink()}
                                            className="dropdown-item"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            {getProfileLabel()}
                                        </Link>
                                        <button
                                            className="dropdown-item"
                                            onClick={toggleTheme}
                                            type="button"
                                        >
                                            {state.theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
                                        </button>
                                        <div className="dropdown-divider"></div>
                                        <button
                                            className="dropdown-item logout-item"
                                            onClick={handleLogout}
                                            type="button"
                                        >
                                            🚪 Выйти
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Для неавторизованных пользователей
                            <>
                                <button
                                    className="theme-toggle"
                                    onClick={toggleTheme}
                                    aria-label="Переключить тему"
                                    type="button"
                                >
                                    {state.theme === 'light' ? '🌙' : '☀️'}
                                </button>
                                {!isLoginPage && (
                                    <Link to="/login" className="login-link">
                                        Войти
                                    </Link>
                                )}
                            </>
                        )}

                        {/* Кнопка мобильного меню */}
                        <button
                            className={`menu-toggle ${isMenuOpen ? 'menu-open' : ''}`}
                            onClick={toggleMenu}
                            aria-label="Открыть меню"
                            type="button"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;