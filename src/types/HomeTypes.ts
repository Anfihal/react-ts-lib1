// src/types/HomeTypes.ts
export interface HomeContent {
    id: string;
    heroTitle: string;
    heroSubtitle: string;
    videoUrl: string;
    videoPoster: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    primaryButtonIcon: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface HomeUpdateRequest {
    heroTitle: string;
    heroSubtitle: string;
    videoUrl: string;
    videoPoster: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    primaryButtonIcon: string;
}