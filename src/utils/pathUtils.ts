export const getAssetPath = (path: string): string => {
    // Для GitHub Pages всегда добавляем базовый путь
    // В development это тоже будет работать, так как Vite обслуживает из корня
    return `/react-ts-lib1${path}`;
};