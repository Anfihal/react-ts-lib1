// Универсальная утилита для путей - работает на любом сервере
export class PathHelper {
    private static basePath: string = '';

    // Инициализация базового пути
    static init() {
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;

            // Автоматически определяем базовый путь
            if (path.includes('/react-ts-lib1')) {
                this.basePath = '/react-ts-lib1';
            } else if (path.includes('/')) {
                // Для других подпапок
                const segments = path.split('/').filter(seg => seg);
                if (segments.length > 0 && !segments[0].includes('.')) {
                    this.basePath = `/${segments[0]}`;
                }
            }
            // Для корневого домена basePath останется пустым
        }
    }

    // Для ассетов (изображения, стили) - УНИВЕРСАЛЬНАЯ
    static getAssetPath(path: string): string {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        // Всегда используем относительные пути или с правильным basePath
        return this.basePath ? `${this.basePath}/${cleanPath}` : `/${cleanPath}`;
    }

    // Для маршрутов React Router
    static getRoutePath(path: string): string {
        return this.basePath ? `${this.basePath}${path}` : path;
    }

    // Получить базовый путь для Router
    static getBasePath(): string {
        return this.basePath;
    }

    // Проверить текущее окружение
    static isGitHubPages(): boolean {
        return this.basePath === '/react-ts-lib1';
    }

    static isLocalhost(): boolean {
        return typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1');
    }

    static isProduction(): boolean {
        // Используем Vite env вместо process.env
        return import.meta.env.PROD;
    }

    static isDevelopment(): boolean {
        // Используем Vite env вместо process.env
        return import.meta.env.DEV;
    }
}

// Инициализируем при импорте
if (typeof window !== 'undefined') {
    PathHelper.init();
}

// Устаревшая функция для обратной совместимости
export const getAssetPath = (path: string): string => {
    return PathHelper.getAssetPath(path);
};

export const getRoutePath = (path: string): string => {
    return PathHelper.getRoutePath(path);
};