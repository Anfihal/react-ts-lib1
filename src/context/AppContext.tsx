import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppAction, AppContextType, User, Service } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
    theme: 'light',
    user: null,
    isAdmin: false,
    isAuthenticated: false,
    services: [],
    cart: [],
    authLoading: false
};

const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'TOGGLE_THEME':
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            return { ...state, theme: newTheme };
        case 'LOGIN_START':
            return { ...state, authLoading: true };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAdmin: action.payload.role === 'admin',
                isAuthenticated: true,
                authLoading: false
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                user: null,
                isAdmin: false,
                isAuthenticated: false,
                authLoading: false
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAdmin: false,
                isAuthenticated: false,
                authLoading: false
            };
        case 'SET_SERVICES':
            return { ...state, services: action.payload };
        case 'ADD_TO_CART':
            return { ...state, cart: [...state.cart, action.payload] };
        case 'REMOVE_FROM_CART':
            return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
        case 'CLEAR_CART':
            return { ...state, cart: [] };
        case 'ADD_SERVICE':
            return { ...state, services: [...state.services, action.payload] };
        case 'UPDATE_SERVICE':
            return {
                ...state,
                services: state.services.map(service =>
                    service.id === action.payload.id ? action.payload : service
                )
            };
        case 'DELETE_SERVICE':
            return {
                ...state,
                services: state.services.filter(service => service.id !== action.payload)
            };
        default:
            return state;
    }
};

// Демо пользователи с паролями
const DEMO_USERS = {
    admin: {
        id: 1,
        email: 'admin@itsolutions.com',
        password: 'admin123',
        name: 'Администратор',
        role: 'admin' as const,
        avatar: '/images/admin-avatar.png'
    },
    guest: {
        id: 2,
        email: 'guest@example.com',
        password: 'guest123',
        name: 'Гость',
        role: 'user' as const,
        avatar: '/images/guest-avatar.png'
    }
};

const initialServices: Service[] = [
    {
        id: 1,
        name: 'Веб-разработка',
        description: 'Создание современных веб-приложений на React и Node.js',
        price: 50000,
        category: 'development',
        image: '/images/web-development.jpg',
        features: ['React', 'Node.js', 'MongoDB']
    },
    {
        id: 2,
        name: 'Мобильная разработка',
        description: 'Разработка кроссплатформенных приложений',
        price: 80000,
        category: 'mobile',
        image: '/images/mobile-development.jpg',
        features: ['React Native', 'Firebase']
    }
];

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const savedUser = localStorage.getItem('user');
        const savedServices = localStorage.getItem('services');

        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            if (savedTheme !== state.theme) {
                dispatch({ type: 'TOGGLE_THEME' });
            }
        }

        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                dispatch({ type: 'LOGIN_SUCCESS', payload: user });
            } catch (error) {
                console.error('Error parsing saved user:', error);
            }
        }

        if (savedServices) {
            try {
                const services = JSON.parse(savedServices);
                dispatch({ type: 'SET_SERVICES', payload: services });
            } catch (error) {
                console.error('Error parsing saved services:', error);
                dispatch({ type: 'SET_SERVICES', payload: initialServices });
            }
        } else {
            dispatch({ type: 'SET_SERVICES', payload: initialServices });
        }
    }, []);

    // Функция входа принимает email и password
    const login = async (email: string, password: string) => {
        dispatch({ type: 'LOGIN_START' });

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Ищем пользователя по email и password
            const userEntry = Object.values(DEMO_USERS).find(
                user => user.email === email && user.password === password
            );

            if (userEntry) {
                const token = btoa(`${email}:${Date.now()}`);

                // Создаем userData без пароля для сохранения в состоянии
                const userData: User = {
                    id: userEntry.id,
                    email: userEntry.email,
                    name: userEntry.name,
                    role: userEntry.role,
                    avatar: userEntry.avatar, // Теперь avatar есть в типе
                    token: token
                };

                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', token);

                dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
                return { success: true, user: userData };
            } else {
                throw new Error('Неверный email или пароль');
            }
        } catch (error) {
            dispatch({ type: 'LOGIN_FAILURE' });
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Произошла ошибка при входе'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AppContext.Provider value={{ state, dispatch, login, logout }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};