export type UserRole = 'guest' | 'admin' | 'moderator' | 'manager';

export interface User {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    lastLogin?: Date;
    permissions: string[];
    avatar?: string;
}

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: UserRole;
    adminCode?: string; // Только для админской регистрации
}

export interface AdminCreateUserData {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: UserRole;
    permissions: string[];
    sendWelcomeEmail: boolean;
}

export interface UserFilters {
    search?: string;
    role?: UserRole;
    isActive?: boolean;
    dateFrom?: string;
    dateTo?: string;
}

export interface UsersStats {
    total: number;
    active: number;
    guests: number;
    admins: number;
    moderators: number;
    managers: number;
    newToday: number;
    online: number;
}