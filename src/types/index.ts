// src/types/index.ts
export type Theme = 'light' | 'dark';

export interface User {
    id: number;
    email: string;
    name: string;
    role: 'admin' | 'user';
    token?: string;
    avatar?: string;
    phone?: string;
    password?: string;
    bio?: string; // ДОБАВЛЕНО
}

// Обычная регистрация пользователя
export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
    phone: string;
}

// Регистрация администратора (только для админов)
export interface AdminRegisterData {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    adminCode: string;
}

export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    features: string[];
}

export interface CartItem extends Service {
    cartId: number;
    quantity: number;
}

export interface AppState {
    theme: Theme;
    user: User | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    services: Service[];
    cart: CartItem[];
    authLoading: boolean;
}

export type AppAction =
    | { type: 'TOGGLE_THEME' }
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: User }
    | { type: 'LOGIN_FAILURE' }
    | { type: 'LOGOUT' }
    | { type: 'SET_SERVICES'; payload: Service[] }
    | { type: 'ADD_TO_CART'; payload: CartItem }
    | { type: 'REMOVE_FROM_CART'; payload: number }
    | { type: 'CLEAR_CART' }
    | { type: 'ADD_SERVICE'; payload: Service }
    | { type: 'UPDATE_SERVICE'; payload: Service }
    | { type: 'DELETE_SERVICE'; payload: number };

export interface RegisterResult {
    success: boolean;
    error?: string;
    user?: User;
}

export interface LoginResult {
    success: boolean;
    error?: string;
    user?: User;
}

export interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
    login: (email: string, password: string) => Promise<LoginResult>;
    register: (data: RegisterData) => Promise<RegisterResult>;
    registerAdmin: (data: AdminRegisterData) => Promise<RegisterResult>;
    logout: () => void;
}

