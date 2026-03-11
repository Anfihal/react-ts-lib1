// src/routes.ts

/**
 * Все маршруты приложения.
 * Централизованное хранение для удобства поддержки и навигации.
 */

export const ROUTES = {
    // Публичные маршруты
    HOME: '/',
    SERVICES: '/services',
    SHOP: '/shop',
    ABOUT: '/about',
    CONTACT: '/contact',
    LOGIN: '/login',

    // Гостевые маршруты (все начинаются с /guest)
    GUEST: {
        BASE: '/guest',
        DASHBOARD: '/guest',
        PROFILE: '/guest/guestprofile',
        ORDERS: '/guest/guestorders',
        SERVICES: '/guest/guestservices',
        SHOP: '/guest/guestshop',
        CART: '/guest/cart',
        ABOUT: '/guest/guestabout',
        CONTACT: '/guest/guestcontact',
    },

    // Админ маршруты (все начинаются с /admin)
    ADMIN: {
        BASE: '/admin',
    },

    // Страница ошибки
    NOT_FOUND: '*',
} as const;

/**
 * Функция для проверки, является ли путь гостевым.
 */
export const isGuestRoute = (path: string): boolean => {
    return path.startsWith(ROUTES.GUEST.BASE);
};

/**
 * Функция для проверки, является ли путь админским.
 */
export const isAdminRoute = (path: string): boolean => {
    return path.startsWith(ROUTES.ADMIN.BASE);
};

/**
 * Тип для публичных маршрутов.
 */
type PublicRoute = typeof ROUTES.HOME | typeof ROUTES.SERVICES | typeof ROUTES.SHOP | typeof ROUTES.ABOUT | typeof ROUTES.CONTACT | typeof ROUTES.LOGIN;

/**
 * Функция для проверки, является ли путь публичным (не требует авторизации).
 */
export const isPublicRoute = (path: string): boolean => {
    const publicRoutes: PublicRoute[] = [
        ROUTES.HOME,
        ROUTES.SERVICES,
        ROUTES.SHOP,
        ROUTES.ABOUT,
        ROUTES.CONTACT,
        ROUTES.LOGIN,
    ];

    return publicRoutes.includes(path as PublicRoute);
};