// Безопасная проверка окружения без process.env
export const isDevelopment = (): boolean => {
    // Для браузера
    if (typeof window !== 'undefined') {
        return window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';
    }
    // Для сборки
    return import.meta.env.DEV;
};

export const isProduction = (): boolean => {
    return import.meta.env.PROD;
};

export const isGitHubPages = (): boolean => {
    if (typeof window !== 'undefined') {
        return window.location.hostname.includes('github.io');
    }
    return false;
};