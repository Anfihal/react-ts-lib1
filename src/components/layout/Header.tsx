// src/components/layout/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getAssetPath, getRoutePath } from '../../utils/pathUtils';
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

    const getCorrectPath = (path: string): string => {
        return getRoutePath(path);
    };

    const getCorrectImagePath = (path: string): string => {
        return getAssetPath(path);
    };

    const currentPath = location.pathname;
    const isAdminArea = currentPath.includes('/admin');
    const isGuestArea = currentPath.includes('/guest');
    const isLoginPage = currentPath.endsWith('/login');
    const isRegisterPage = currentPath.endsWith('/register');

    const isPublicRoute = [
        '/',
        '/services',
        '/shop',
        '/about',
        '/contact',
        '/reviews',
        '/login',
        '/register'
    ].some(route => currentPath === getCorrectPath(route) || currentPath === route);

    // Легкая логика редиректов ТОЛЬКО для авторизованных пользователей
    useEffect(() => {
        if (state.isAuthenticated) {
            if (state.isAdmin && isPublicRoute && !isAdminArea) {
                navigate(getCorrectPath('/admin'));
                return;
            }
            if (!state.isAdmin && isPublicRoute && !isGuestArea && !isLoginPage && !isRegisterPage) {
                navigate(getCorrectPath('/guest'));
                return;
            }
        }
    }, [state.isAuthenticated, state.isAdmin, isAdminArea, isGuestArea, isPublicRoute, isLoginPage, isRegisterPage, currentPath, navigate]);

    const toggleTheme = (): void => {
        dispatch({ type: 'TOGGLE_THEME' });
    };

    const toggleMenu = (): void => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = (): void => {
        logout();
        setIsUserMenuOpen(false);
        navigate(getCorrectPath('/'));
    };

    const toggleUserMenu = (): void => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

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

    const getNavigationLinks = (): NavigationLink[] => {
        if (isAdminArea) {
            return [
                { to: getCorrectPath("/admin"), label: "Дашборд" },
                { to: getCorrectPath("/admin/home"), label: "Главная" },
                { to: getCorrectPath("/admin/chat"), label: "Чат поддержки" },
                { to: getCorrectPath("/admin/stats"), label: "Статистика" },
                { to: getCorrectPath("/admin/services"), label: "Услуги" },
                { to: getCorrectPath("/admin/products"), label: "Товары" },
                { to: getCorrectPath("/admin/users"), label: "Пользователи" },
                { to: getCorrectPath("/admin/contact"), label: "Контакты" },
                { to: getCorrectPath("/admin/about"), label: "О нас" },
                { to: getCorrectPath("/admin/reviews"), label: "Отзывы" }
            ];
        }

        if (isGuestArea) {
            return [
                { to: getCorrectPath("/guest"), label: "Обзор" },
                { to: getCorrectPath("/guest/guestprofile"), label: "Профиль" },
                { to: getCorrectPath("/guest/guestorders"), label: "Мои заказы" },
                { to: getCorrectPath("/guest/guestservices"), label: "Услуги" },
                { to: getCorrectPath("/guest/guestshop"), label: "Магазин" },
                { to: getCorrectPath("/guest/cart"), label: "Корзина" },
                { to: getCorrectPath("/guest/guestabout"), label: "О нас" },
                { to: getCorrectPath("/guest/reviews"), label: "Отзывы" },
                { to: getCorrectPath("/guest/guestcontact"), label: "Контакты" }
            ];
        }

        const mainLinks: NavigationLink[] = [
            { to: getCorrectPath("/"), label: "Главная" },
            { to: getCorrectPath("/services"), label: "Услуги" },
            { to: getCorrectPath("/shop"), label: "Магазин" },
            { to: getCorrectPath("/about"), label: "О нас" },
            { to: getCorrectPath("/contact"), label: "Контакты" },
            { to: getCorrectPath("/reviews"), label: "Отзывы" }
        ];

        if (state.isAuthenticated) {
            if (state.isAdmin) {
                mainLinks.push({ to: getCorrectPath("/admin"), label: "Админка" });
            } else {
                mainLinks.push({ to: getCorrectPath("/guest"), label: "Кабинет" });
            }
        }

        // ❌ НЕ ДОБАВЛЯЕМ "Войти" В МЕНЮ — ОНА БУДЕТ ТОЛЬКО В HEADER-ACTIONS
        return mainLinks;
    };

    const getDashboardLink = (): string => {
        return getCorrectPath(state.isAdmin ? '/admin' : '/guest');
    };

    const getProfileLink = (): string => {
        return getCorrectPath(state.isAdmin ? '/admin/profile' : '/guest/guestprofile');
    };

    const getDashboardLabel = (): string => {
        return state.isAdmin ? 'Панель управления' : 'Личный кабинет';
    };

    const getProfileLabel = (): string => {
        return state.isAdmin ? 'Профиль администратора' : 'Профиль';
    };

    const getUserRole = (): string => {
        return state.isAdmin ? 'Администратор' : 'Пользователь';
    };

    const handleLogoClick = (e: React.MouseEvent) => {
        if (state.isAuthenticated && !state.isAdmin) {
            e.preventDefault();
            navigate(getCorrectPath('/guest'));
        }
    };

    const isLinkActive = (linkTo: string): boolean => {
        return location.pathname === linkTo;
    };

    return (
        <header className={`header ${isAdminArea ? 'admin-header' : ''} ${isGuestArea ? 'guest-header' : ''} ${isPublicRoute ? 'public-header' : ''}`}>
            <div className="container">
                <div className="header-content">
                    <Link
                        to={getCorrectPath(state.isAuthenticated && !state.isAdmin ? '/guest' : '/')}
                        className="logo"
                        onClick={handleLogoClick}
                    >
                        <img
                            alt='IT Solutions'
                            className="logo-image"
                            src={state.theme === 'dark'
                                ? getCorrectImagePath("/images/logo/logo.png")
                                : getCorrectImagePath("/images/logo/logo-white.png")
                            }
                            onError={(e) => {
                                console.warn('Failed to load image:', e.currentTarget.src);
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </Link>

                    <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                        {getNavigationLinks().map((link: NavigationLink) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`nav-link ${isLinkActive(link.to) ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="header-actions">
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
                                                src={getCorrectImagePath(state.user.avatar)}
                                                alt={state.user.name || 'User'}
                                                className="avatar-image"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
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
                                            {state.theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
                                        </button>
                                        <div className="dropdown-divider"></div>
                                        <button
                                            className="dropdown-item logout-item"
                                            onClick={handleLogout}
                                            type="button"
                                        >
                                            Выйти
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {!isLoginPage && !isRegisterPage && (
                                    <>
                                        <button
                                            className="theme-toggle"
                                            onClick={toggleTheme}
                                            aria-label="Переключить тему"
                                            type="button"
                                        >
                                            {state.theme === 'light' ? '🌙' : '☀️'}
                                        </button>
                                        <Link
                                            to={getCorrectPath("/login")}
                                            className="login-link"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Войти
                                        </Link>
                                    </>
                                )}
                            </>
                        )}

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