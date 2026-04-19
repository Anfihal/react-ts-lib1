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
                                            className={`theme-toggle ${state.theme === 'dark' ? 'dark' : ''}`}
                                            onClick={toggleTheme}
                                            aria-label="Переключить тему"
                                            type="button"
                                        >
                                            <div className="theme-toggle__thumb">
                                                <div className="theme-toggle__glass" />
                                                <div className="theme-toggle__icons">
                                                    {/* Sun */}
                                                    <div className="theme-toggle__sun">
                                                        <svg viewBox="0 0 132 132" fill="none">
                                                            <circle cx="66.3215" cy="27.8735" r="2.95332" fill="white" />
                                                            <circle cx="103.351" cy="64.9034" r="2.95332" transform="rotate(90 103.351 64.9034)" fill="white" />
                                                            <circle cx="40.137" cy="91.0878" r="2.95332" transform="rotate(-135 40.137 91.0878)" fill="white" />
                                                            <circle cx="32.3098" cy="79.5476" r="2.95332" transform="rotate(-113.295 32.3098 79.5476)" fill="white" />
                                                            <circle cx="52.4207" cy="99.2253" r="2.95332" transform="rotate(-157.951 52.4207 99.2253)" fill="white" />
                                                            <circle cx="92.5054" cy="91.088" r="2.95332" transform="rotate(135 92.5054 91.088)" fill="white" />
                                                            <circle cx="100.358" cy="79.4883" r="2.95332" transform="rotate(113.196 100.358 79.4883)" fill="white" />
                                                            <circle cx="80.5454" cy="99.0929" r="2.95332" transform="rotate(157.41 80.5454 99.0929)" fill="white" />
                                                            <circle cx="66.3215" cy="101.934" r="2.95332" fill="white" />
                                                            <circle cx="29.2917" cy="64.9034" r="2.95332" transform="rotate(90 29.2917 64.9034)" fill="white" />
                                                            <circle cx="92.5056" cy="38.7192" r="2.95332" transform="rotate(-135 92.5056 38.7192)" fill="white" />
                                                            <circle cx="100.333" cy="50.2598" r="2.95332" transform="rotate(-113.295 100.333 50.2598)" fill="white" />
                                                            <circle cx="80.2221" cy="30.5817" r="2.95332" transform="rotate(-157.951 80.2221 30.5817)" fill="white" />
                                                            <circle cx="40.1368" cy="38.72" r="2.95332" transform="rotate(135 40.1368 38.72)" fill="white" />
                                                            <circle cx="32.2836" cy="50.3188" r="2.95332" transform="rotate(113.196 32.2836 50.3188)" fill="white" />
                                                            <circle cx="52.0964" cy="30.7145" r="2.95332" transform="rotate(157.41 52.0964 30.7145)" fill="white" />
                                                            <path d="M40.9069 58.162C44.682 44.0736 59.1638 35.7131 73.2523 39.4881C87.3408 43.2632 95.7013 57.7442 91.9265 71.8326C88.1514 85.9212 73.6703 94.2826 59.5817 90.5077C45.4931 86.7327 37.1319 72.2506 40.9069 58.162Z" fill="white" />
                                                        </svg>
                                                    </div>
                                                    {/* Moon */}
                                                    <div className="theme-toggle__moon">
                                                        <svg viewBox="0 0 136 132" fill="none">
                                                            <path d="M54.6181 35.6234C53.5989 38.719 53.0449 42.0264 53.0449 45.4633C53.045 62.827 67.1216 76.9027 84.4853 76.9027C88.5426 76.9027 92.4198 76.1332 95.9804 74.7338C91.8502 87.2777 80.041 96.3342 66.1142 96.3344C48.7504 96.3344 34.6738 82.2577 34.6738 64.8939C34.6739 51.5876 42.9407 40.2132 54.6181 35.6234Z" fill="white" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
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