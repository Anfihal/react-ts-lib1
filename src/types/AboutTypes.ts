// src/types/AboutTypes.ts
export interface AboutContent {
    id: string;
    companyName: string;
    title: string;
    subtitle: string;
    description: string;
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

export interface AboutUpdateRequest {
    companyName: string;
    title: string;
    subtitle: string;
    description: string;
    mission: string;
    vision: string;
    values: string[];
    stats: CompanyStat[];
    teamMembers: TeamMember[];
    achievements: Achievement[];
}
export interface TeamMember {
    id: number;
    name: string;
    position: string;
    description: string;
    imageUrl: string;
    imagePosition?: string;      // 'center', 'top', 'bottom' или координаты
    imageSize?: 'cover' | 'contain' | 'fill';
    imageScale?: number;          // масштаб от 0.5 до 3
    socialLinks?: {
        linkedin?: string;
        telegram?: string;
        github?: string;
    };
}