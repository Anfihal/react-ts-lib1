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
    };
    mapEmbedUrl?: string;
}