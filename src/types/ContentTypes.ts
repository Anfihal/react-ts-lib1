export interface ContentBlock {
    id: string;
    type: 'text' | 'image' | 'hero' | 'features' | 'cta' | 'html';
    content: string;
    order: number;
    page: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PageContent {
    page: string;
    title: string;
    description?: string;
    blocks: ContentBlock[];
    lastUpdated: Date;
}

export interface ContentUpdateRequest {
    page: string;
    blocks: Omit<ContentBlock, 'id' | 'createdAt' | 'updatedAt'>[];
}
