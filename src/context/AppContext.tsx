// src/context/AppContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
    AppState,
    AppAction,
    AppContextType,
    User,
    Service,
    RegisterData,
    AdminRegisterData,
    RegisterResult,
    LoginResult
} from '../types';

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

// Демо пользователи с паролями (обновлены с полем bio)
const DEMO_USERS: Array<User & { password: string }> = [
    {
        id: 1,
        email: 'admin@itsolutions.com',
        password: 'admin123',
        name: 'Администратор',
        role: 'admin',
        avatar: '/images/admin-avatar.png',
        phone: '+7 (999) 123-45-67',
        bio: 'Администратор системы с полным доступом',
        token: btoa('admin@itsolutions.com:admin123')
    },
    {
        id: 2,
        email: 'user@example.com',
        password: 'user123',
        name: 'Пользователь',
        role: 'user',
        avatar: '/images/user-avatar.png',
        phone: '+7 (999) 987-65-43',
        bio: 'Обычный пользователь системы',
        token: btoa('user@example.com:user123')
    }
];

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
            const user = action.payload;
            return {
                ...state,
                user: user,
                isAdmin: user.role === 'admin',
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

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        // Восстановление темы
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            if (savedTheme !== state.theme) {
                dispatch({ type: 'TOGGLE_THEME' });
            }
        }

        // Восстановление пользователя
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser && savedToken) {
            try {
                const user = JSON.parse(savedUser) as User;
                dispatch({ type: 'LOGIN_SUCCESS', payload: user });
            } catch (error) {
                console.error('Error parsing saved user:', error);
            }
        }

        // Восстановление услуг
        const savedServices = localStorage.getItem('services');
        if (savedServices) {
            try {
                const services = JSON.parse(savedServices) as Service[];
                dispatch({ type: 'SET_SERVICES', payload: services });
            } catch (error) {
                console.error('Error parsing saved services:', error);
                dispatch({ type: 'SET_SERVICES', payload: initialServices });
            }
        } else {
            dispatch({ type: 'SET_SERVICES', payload: initialServices });
        }
    }, []);

    const login = async (email: string, password: string): Promise<LoginResult> => {
        dispatch({ type: 'LOGIN_START' });

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Сначала проверяем демо пользователей
            let user: User | null = null;

            // Проверяем демо пользователей
            const demoUser = DEMO_USERS.find(
                u => u.email === email && u.password === password
            );

            if (demoUser) {
                // Убираем пароль из объекта пользователя
                const { password: _, ...userWithoutPassword } = demoUser;
                user = userWithoutPassword;
            } else {
                // Проверяем зарегистрированных пользователей
                const savedUsers = localStorage.getItem('registeredUsers');
                if (savedUsers) {
                    const registeredUsers: Array<User & { password: string }> = JSON.parse(savedUsers);
                    const registeredUser = registeredUsers.find(
                        u => u.email === email && u.password === password
                    );

                    if (registeredUser) {
                        const { password: _, ...userWithoutPassword } = registeredUser;
                        user = userWithoutPassword;
                    }
                }
            }

            if (user) {
                // Генерируем новый токен
                const token = btoa(`${email}:${Date.now()}`);
                const userWithToken: User = { ...user, token };

                // Сохраняем в localStorage
                localStorage.setItem('user', JSON.stringify(userWithToken));
                localStorage.setItem('token', token);

                // Обновляем состояние
                dispatch({ type: 'LOGIN_SUCCESS', payload: userWithToken });

                return {
                    success: true,
                    user: userWithToken
                };
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

    const register = async (data: RegisterData): Promise<RegisterResult> => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Валидация пароля
            if (data.password.length < 6) {
                throw new Error('Пароль должен содержать минимум 6 символов');
            }

            // Получаем сохраненных пользователей
            const savedUsers = localStorage.getItem('registeredUsers');
            const registeredUsers: Array<User & { password: string }> = savedUsers ? JSON.parse(savedUsers) : [];

            // Проверяем всех пользователей (демо + зарегистрированные)
            const allUsers = [...DEMO_USERS, ...registeredUsers];
            const existingUser = allUsers.find(user => user.email === data.email);

            if (existingUser) {
                throw new Error('Пользователь с таким email уже существует');
            }

            // Создаем нового пользователя
            const newUserId = Date.now();
            const newUser: User = {
                id: newUserId,
                email: data.email,
                name: data.fullName,
                role: 'user',
                avatar: '/images/user-avatar.png',
                phone: data.phone,
                bio: ''
            };

            // Сохраняем пользователя с паролем
            const newUserWithPassword: User & { password: string } = {
                ...newUser,
                password: data.password
            };

            // Сохраняем в localStorage
            localStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, newUserWithPassword]));

            return {
                success: true,
                user: newUser
            };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Произошла ошибка при регистрации'
            };
        }
    };

    const registerAdmin = async (data: AdminRegisterData): Promise<RegisterResult> => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Проверка adminCode
            const VALID_ADMIN_CODE = 'ADMIN123';
            if (data.adminCode !== VALID_ADMIN_CODE) {
                throw new Error('Неверный системный код администратора');
            }

            // Валидация пароля
            if (data.password.length < 6) {
                throw new Error('Пароль должен содержать минимум 6 символов');
            }

            // Получаем сохраненных пользователей
            const savedUsers = localStorage.getItem('registeredUsers');
            const registeredUsers: Array<User & { password: string }> = savedUsers ? JSON.parse(savedUsers) : [];

            // Проверяем всех пользователей
            const allUsers = [...DEMO_USERS, ...registeredUsers];
            const existingUser = allUsers.find(user => user.email === data.email);

            if (existingUser) {
                throw new Error('Пользователь с таким email уже существует');
            }

            // Создаем нового администратора
            const newUserId = Date.now();
            const newAdmin: User = {
                id: newUserId,
                email: data.email,
                name: data.fullName,
                role: 'admin',
                avatar: '/images/admin-avatar.png',
                phone: data.phone,
                bio: ''
            };

            // Сохраняем администратора с паролем
            const newAdminWithPassword: User & { password: string } = {
                ...newAdmin,
                password: data.password
            };

            // Сохраняем в localStorage
            localStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, newAdminWithPassword]));

            return {
                success: true,
                user: newAdmin
            };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Произошла ошибка при создании администратора'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AppContext.Provider value={{
            state,
            dispatch,
            login,
            register,
            registerAdmin,
            logout
        }}>
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