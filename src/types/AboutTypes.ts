// Тип для содержимого герой-секции одного направления
export interface HeroContent {
    companyName: string;
    title: string;
    subtitle: string;
    description: string;
    characterImage?: string; // путь к изображению персонажа (опционально)
}

// Основной контент страницы "О нас"
export interface AboutContent {
    id: string;
    // Устаревшие общие поля герой-секции (можно оставить для обратной совместимости, но они не используются)
    companyName: string;
    title: string;
    subtitle: string;
    description: string;
    // Новые поля для раздельного отображения направлений
    heroWeb: HeroContent;
    heroThreeD: HeroContent;
    mission: string;
    vision: string;
    values: string[];
    stats: CompanyStat[];
    teamMembers: TeamMember[];
    achievements: Achievement[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CompanyStat {
    id: number;
    number: string;
    label: string;
}

export interface TeamMember {
    id: number;
    name: string;
    position: string;
    description: string;
    imageUrl: string;
    imagePosition?: 'top' | 'center' | 'bottom'; // позиция фокуса изображения
    imageSize?: 'cover' | 'contain' | 'fill';    // режим масштабирования
    imageScale?: number;                          // дополнительный масштаб (0.5–3)
    socialLinks?: {
        linkedin?: string;
        telegram?: string;
        github?: string;
    };
}

export interface Achievement {
    id: number;
    year: string;
    title: string;
    description: string;
}

// Запрос на обновление содержимого (может быть частичным)
export interface AboutUpdateRequest {
    companyName?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    heroWeb?: Partial<HeroContent>;
    heroThreeD?: Partial<HeroContent>;
    mission?: string;
    vision?: string;
    values?: string[];
    stats?: CompanyStat[];
    teamMembers?: TeamMember[];
    achievements?: Achievement[];
}