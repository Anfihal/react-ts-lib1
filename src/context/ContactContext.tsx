import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ContactInfo, ContactUpdateRequest } from '../types/ContactTypes';

interface ContactState {
    contactInfo: ContactInfo | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
}

type ContactAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_SAVING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'LOAD_CONTACT_INFO'; payload: ContactInfo | null }
    | { type: 'UPDATE_CONTACT_INFO'; payload: ContactInfo };

const ContactContext = createContext<{
    state: ContactState;
    updateContactInfo: (data: ContactUpdateRequest) => Promise<void>;
    getContactInfo: () => ContactInfo | null;
    resetContactInfo: () => void;
    deleteContactInfo: () => Promise<void>;
} | null>(null);

const contactReducer = (state: ContactState, action: ContactAction): ContactState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_SAVING':
            return { ...state, isSaving: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'LOAD_CONTACT_INFO':
            return { ...state, contactInfo: action.payload, error: null };
        case 'UPDATE_CONTACT_INFO':
            return { ...state, contactInfo: action.payload, error: null };
        default:
            return state;
    }
};

const initialContactInfo: ContactInfo = {
    id: '1',
    companyName: 'Infinite leaders Tech',
    address: 'г. Москва, ул. Примерная, д. 123',
    phone: '+7 (000) 000-00-00',
    email: 'InfiniteleadersTech@yandex.ru',
    workingHours: 'Пн-Пт: 9:00-18:00, Сб-Вс: выходной',
    socialLinks: {
        telegram: 'https://t.me/InfiniteleadersTech',
        whatsapp: 'https://wa.me/79991234567',
        vk: 'https://vk.com/itsolutions',
        instagram: 'https://instagram.com/infiniteleaders'
    },
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=...',
    lastUpdated: new Date()
};

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(contactReducer, {
        contactInfo: null,
        isLoading: false,
        isSaving: false,
        error: null
    });

    const getContactInfo = (): ContactInfo | null => {
        return state.contactInfo;
    };

    const resetContactInfo = () => {
        dispatch({ type: 'LOAD_CONTACT_INFO', payload: initialContactInfo });
    };

    const deleteContactInfo = async () => {
        try {
            dispatch({ type: 'SET_SAVING', payload: true });
            await new Promise(resolve => setTimeout(resolve, 1000));
            dispatch({ type: 'LOAD_CONTACT_INFO', payload: null });
            dispatch({ type: 'SET_SAVING', payload: false });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Ошибка при удалении контактов' });
            dispatch({ type: 'SET_SAVING', payload: false });
        }
    };

    const updateContactInfo = async (data: ContactUpdateRequest): Promise<void> => {
        try {
            dispatch({ type: 'SET_SAVING', payload: true });

            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedContact: ContactInfo = {
                ...data,
                id: '1',
                lastUpdated: new Date()
            };

            dispatch({ type: 'UPDATE_CONTACT_INFO', payload: updatedContact });
            dispatch({ type: 'SET_SAVING', payload: false });

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Ошибка при обновлении контактов' });
            dispatch({ type: 'SET_SAVING', payload: false });
        }
    };

    useEffect(() => {
        dispatch({ type: 'LOAD_CONTACT_INFO', payload: initialContactInfo });
    }, []);

    return (
        <ContactContext.Provider value={{ state, updateContactInfo, getContactInfo, resetContactInfo, deleteContactInfo }}>
            {children}
        </ContactContext.Provider>
    );
};

export const useContact = () => {
    const context = useContext(ContactContext);
    if (!context) {
        throw new Error('useContact must be used within a ContactProvider');
    }
    return context;
};