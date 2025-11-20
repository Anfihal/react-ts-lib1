export type Theme = 'light' | 'dark';

export interface User {
    id: number; // Изменил с string на number чтобы соответствовать данным
    email: string;
    name: string;
    role: 'admin' | 'user';
    token?: string;
    avatar?: string; // ДОБАВИЛ avatar
    password?: string; // Для внутреннего использования
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

export interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
    login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
    logout: () => void;
}