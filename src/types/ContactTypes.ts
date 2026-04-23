// src/types/ContactTypes.ts
export interface ContactInfo {
    id: string;
    companyName: string;
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    socialLinks: {
        telegram?: string;
        whatsapp?: string;
        vk?: string;
        instagram?: string;
        odnoklassniki?: string; // Добавлены Одноклассники
        zen?: string;           // Добавлен Дзен
    };
    mapEmbedUrl?: string;
    lastUpdated: Date;
}

export interface ContactUpdateRequest {
    companyName: string;
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    socialLinks: {
        telegram?: string;
        whatsapp?: string;
        vk?: string;
        instagram?: string;
        odnoklassniki?: string;
        zen?: string;
    };
    mapEmbedUrl?: string;
}