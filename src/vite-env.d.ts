// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly BASE_URL: string
    readonly MODE: string
    readonly DEV: boolean
    readonly PROD: boolean
    readonly SSR: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
/// <reference types="vite/client" />

declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}

declare module 'swiper/css';
declare module 'swiper/css/pagination';
declare module 'swiper/css/navigation';