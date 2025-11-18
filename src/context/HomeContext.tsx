// src/context/HomeContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { HomeContent, HomeUpdateRequest } from '../types/HomeTypes';

interface HomeState {
    homeContent: HomeContent | null;
    isLoading: boolean;
    error: string | null;
    isEditing: boolean;
}

type HomeAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'LOAD_HOME_CONTENT'; payload: HomeContent }
    | { type: 'UPDATE_HOME_CONTENT'; payload: HomeContent }
    | { type: 'SET_EDITING'; payload: boolean };

interface HomeContextType {
    state: HomeState;
    updateHomeContent: (data: HomeUpdateRequest) => Promise<void>;
    setEditing: (editing: boolean) => void;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

const homeReducer = (state: HomeState, action: HomeAction): HomeState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'LOAD_HOME_CONTENT':
            return { ...state, homeContent: action.payload, error: null };
        case 'UPDATE_HOME_CONTENT':
            return { ...state, homeContent: action.payload, error: null };
        case 'SET_EDITING':
            return { ...state, isEditing: action.payload };
        default:
            return state;
    }
};

const initialHomeContent: HomeContent = {
    id: '1',
    heroTitle: 'Профессиональные IT-решения для вашего бизнеса',
    heroSubtitle: 'Разработка, дизайн и консалтинг от опытной команды специалистов',
    videoUrl: '/videos/hero-background.mp4',
    videoPoster: '/images/video-poster.jpg',
    primaryButtonText: 'Начать проект',
    secondaryButtonText: 'Узнать больше',
    primaryButtonIcon: '🚀',
    createdAt: new Date(),
    updatedAt: new Date()
};

export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(homeReducer, {
        homeContent: null,
        isLoading: false,
        error: null,
        isEditing: false
    });

    const updateHomeContent = async (data: HomeUpdateRequest): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedContent: HomeContent = {
                ...data,
                id: '1',
                createdAt: state.homeContent?.createdAt || new Date(),
                updatedAt: new Date()
            };

            dispatch({ type: 'UPDATE_HOME_CONTENT', payload: updatedContent });
            dispatch({ type: 'SET_EDITING', payload: false });

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Ошибка при обновлении главной страницы' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const setEditing = (editing: boolean) => {
        dispatch({ type: 'SET_EDITING', payload: editing });
    };

    useEffect(() => {
        dispatch({ type: 'LOAD_HOME_CONTENT', payload: initialHomeContent });
    }, []);

    const value: HomeContextType = {
        state,
        updateHomeContent,
        setEditing
    };

    return (
        <HomeContext.Provider value={value}>
            {children}
        </HomeContext.Provider>
    );
};

export const useHome = (): HomeContextType => {
    const context = useContext(HomeContext);
    if (context === undefined) {
        throw new Error('useHome must be used within a HomeProvider');
    }
    return context;
};