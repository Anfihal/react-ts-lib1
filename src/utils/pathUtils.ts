// src/utils/pathUtils.ts
/**
 * Утилиты для работы с путями в Vite
 */

// Базовый путь из окружения Vite
const BASE_PATH = import.meta.env.BASE_URL || '';

/**
 * Получение пути для маршрутизации
 */
export const getRoutePath = (path: string): string => {
    // Убираем дублирование базового пути
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Если путь уже содержит базовый путь, возвращаем как есть
    if (BASE_PATH && normalizedPath.startsWith(BASE_PATH)) {
        return normalizedPath;
    }

    // Добавляем базовый путь
    return `${BASE_PATH}${normalizedPath}`;
};

/**
 * Получение пути для ассетов (изображения, стили) в Vite
 */
export const getAssetPath = (path: string): string => {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

    // В Vite ассеты обрабатываются по-разному в dev и production
    if (import.meta.env.DEV) {
        // В режиме разработки используем абсолютные пути
        return `/${normalizedPath}`;
    } else {
        // В production используем базовый путь
        if (BASE_PATH) {
            return `${BASE_PATH}/${normalizedPath}`;
        }
        return `/${normalizedPath}`;
    }
};

/**
 * Проверка активного пути
 */
export const isActivePath = (currentPath: string, targetPath: string): boolean => {
    // Нормализуем пути (убираем trailing slash)
    const normalizedCurrent = currentPath.replace(/\/$/, '');
    const normalizedTarget = targetPath.replace(/\/$/, '');

    return normalizedCurrent === normalizedTarget;
};

/**
 * Вспомогательные функции для определения окружения
 */
export const isDevelopment = (): boolean => {
    return import.meta.env.DEV;
};

export const isProduction = (): boolean => {
    return import.meta.env.PROD;
};

export const getBaseUrl = (): string => {
    return BASE_PATH;
};