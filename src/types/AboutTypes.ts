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
    icon: string;
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
    icon: string;
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