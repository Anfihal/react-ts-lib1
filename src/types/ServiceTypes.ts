// src/types/ServiceTypes.ts
export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    duration?: string;
    imageUrl?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServiceCreateRequest {
    name: string;
    description: string;
    price: number;
    category: string;
    duration?: string;
    imageUrl?: string;
}

export interface ServiceUpdateRequest {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    duration?: string;
    imageUrl?: string;
    isActive: boolean;
}