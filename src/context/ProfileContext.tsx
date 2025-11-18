import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode, Dispatch } from 'react'; // Type-only import

// Типы для профиля
export interface ProfileData {
    id: string;
    name: string;
    email: string;
    phone?: string;
    position?: string;
    bio?: string;
    avatar?: string;
    role: 'admin' | 'user';
    createdAt: string;
    lastLogin?: string;
    notifications: boolean;
    language: string;
    timezone: string;
}

interface ProfileState {
    profile: ProfileData | null;
    isLoading: boolean;
    error: string | null;
    isEditing: boolean;
}

type ProfileAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_PROFILE'; payload: ProfileData }
    | { type: 'UPDATE_PROFILE'; payload: Partial<ProfileData> }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'SET_EDITING'; payload: boolean }
    | { type: 'CLEAR_ERROR' }
    | { type: 'RESET_PROFILE' };

interface ProfileContextType {
    state: ProfileState;
    dispatch: Dispatch<ProfileAction>;
    updateProfile: (data: Partial<ProfileData>) => Promise<void>;
    fetchProfile: (userId: string) => Promise<void>;
    toggleEditing: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Начальное состояние
const initialState: ProfileState = {
    profile: null,
    isLoading: false,
    error: null,
    isEditing: false
};

// Редьюсер
const profileReducer = (state: ProfileState, action: ProfileAction): ProfileState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'SET_PROFILE':
            return { ...state, profile: action.payload, error: null };

        case 'UPDATE_PROFILE':
            return {
                ...state,
                profile: state.profile ? { ...state.profile, ...action.payload } : null
            };

        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };

        case 'SET_EDITING':
            return { ...state, isEditing: action.payload };

        case 'CLEAR_ERROR':
            return { ...state, error: null };

        case 'RESET_PROFILE':
            return initialState;

        default:
            return state;
    }
};

// Провайдер
interface ProfileProviderProps {
    children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(profileReducer, initialState);

    // Загрузка профиля
    const fetchProfile = async (userId: string): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            // Имитация API запроса
            const mockProfile: ProfileData = {
                id: userId,
                name: 'Администратор',
                email: 'admin@itsolutions.com',
                phone: '+7 (999) 123-45-67',
                position: 'Старший администратор',
                bio: 'Ответственный за управление системой и пользователями',
                avatar: '/images/avatars/admin-avatar.png',
                role: 'admin',
                createdAt: '2024-01-15T10:00:00Z',
                lastLogin: new Date().toISOString(),
                notifications: true,
                language: 'ru',
                timezone: 'Europe/Moscow'
            };

            // Имитация задержки сети
            await new Promise(resolve => setTimeout(resolve, 500));

            dispatch({ type: 'SET_PROFILE', payload: mockProfile });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Ошибка загрузки профиля' });
        }
    };

    // Обновление профиля
    const updateProfile = async (data: Partial<ProfileData>): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 500));

            dispatch({ type: 'UPDATE_PROFILE', payload: data });
            dispatch({ type: 'SET_EDITING', payload: false });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Ошибка обновления профиля' });
        }
    };

    // Переключение режима редактирования
    const toggleEditing = (): void => {
        dispatch({ type: 'SET_EDITING', payload: !state.isEditing });
    };

    const value: ProfileContextType = {
        state,
        dispatch,
        updateProfile,
        fetchProfile,
        toggleEditing
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};

// Хук для использования контекста
export const useProfile = (): ProfileContextType => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};