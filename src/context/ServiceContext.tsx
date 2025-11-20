// src/context/ServiceContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Service, ServiceCreateRequest, ServiceUpdateRequest } from '../types/ServiceTypes';

interface ServiceState {
    services: Service[];
    isLoading: boolean;
    error: string | null;
    editingService: Service | null;
}

type ServiceAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'LOAD_SERVICES'; payload: Service[] }
    | { type: 'ADD_SERVICE'; payload: Service }
    | { type: 'UPDATE_SERVICE'; payload: Service }
    | { type: 'DELETE_SERVICE'; payload: number }
    | { type: 'SET_EDITING_SERVICE'; payload: Service | null };

interface ServiceContextType {
    state: ServiceState;
    addService: (data: ServiceCreateRequest) => Promise<void>;
    updateService: (data: ServiceUpdateRequest) => Promise<void>;
    deleteService: (id: number) => Promise<void>;
    setEditingService: (service: Service | null) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

const serviceReducer = (state: ServiceState, action: ServiceAction): ServiceState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'LOAD_SERVICES':
            return { ...state, services: action.payload, error: null };
        case 'ADD_SERVICE':
            return { ...state, services: [...state.services, action.payload], error: null };
        case 'UPDATE_SERVICE':
            return {
                ...state,
                services: state.services.map(s => s.id === action.payload.id ? action.payload : s),
                error: null
            };
        case 'DELETE_SERVICE':
            return {
                ...state,
                services: state.services.filter(s => s.id !== action.payload),
                error: null
            };
        case 'SET_EDITING_SERVICE':
            return { ...state, editingService: action.payload };
        default:
            return state;
    }
};
// Связать с бд, на данный момент тестовые данныые
const initialServices: Service[] = [
    {
        id: 1,
        name: 'Веб-разработка',
        description: 'Создание современных веб-приложений на React и Node.js',
        price: 50000,
        category: 'Разработка',
        duration: '2-4 недели',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        id: 2,
        name: 'UI/UX Дизайн',
        description: 'Проектирование пользовательских интерфейсов и опыт взаимодействия',
        price: 30000,
        category: 'Дизайн',
        duration: '1-2 недели',
        isActive: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
    }
];

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(serviceReducer, {
        services: [],
        isLoading: false,
        error: null,
        editingService: null
    });

    const addService = async (data: ServiceCreateRequest): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newService: Service = {
                ...data,
                id: Math.max(0, ...state.services.map(s => s.id)) + 1,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            dispatch({ type: 'ADD_SERVICE', payload: newService });
            console.log('Service added:', newService);

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Ошибка при добавлении услуги' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const updateService = async (data: ServiceUpdateRequest): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Находим текущую услугу чтобы сохранить createdAt
            const currentService = state.services.find(s => s.id === data.id);

            const updatedService: Service = {
                ...data,
                createdAt: currentService?.createdAt || new Date(), // Сохраняем оригинальную дату создания
                updatedAt: new Date()
            };

            dispatch({ type: 'UPDATE_SERVICE', payload: updatedService });
            dispatch({ type: 'SET_EDITING_SERVICE', payload: null });
            console.log('Service updated:', updatedService);

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Ошибка при обновлении услуги' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const deleteService = async (id: number): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            await new Promise(resolve => setTimeout(resolve, 500));

            dispatch({ type: 'DELETE_SERVICE', payload: id });
            console.log('Service deleted:', id);

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Ошибка при удалении услуги' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const setEditingService = (service: Service | null) => {
        dispatch({ type: 'SET_EDITING_SERVICE', payload: service });
    };

    useEffect(() => {
        dispatch({ type: 'LOAD_SERVICES', payload: initialServices });
    }, []);

    const value: ServiceContextType = {
        state,
        addService,
        updateService,
        deleteService,
        setEditingService
    };

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useService = () => {
    const context = useContext(ServiceContext);
    if (context === undefined) {
        throw new Error('useService must be used within a ServiceProvider');
    }
    return context;
};