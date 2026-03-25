// src/types/ProductTypes.ts
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    imageUrl: string;
    images?: string[];
    inStock: boolean;
    stockQuantity: number;
    tags: string[];
    features: string[];
    specifications: Record<string, string>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductCreateRequest {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    imageUrl: string;
    images?: string[];
    stockQuantity: number;
    tags: string[];
    features: string[];
    specifications: Record<string, string>;
}

export interface ProductUpdateRequest {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    imageUrl: string;
    images?: string[];
    inStock: boolean;
    stockQuantity: number;
    tags: string[];
    features: string[];
    specifications: Record<string, string>;
    isActive: boolean;
}