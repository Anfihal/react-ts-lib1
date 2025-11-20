import React, { createContext, useContext, useState } from 'react';

interface ContactInfo {
    companyName: string;
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    socialLinks: {
        telegram?: string;
        whatsapp?: string;
        vk?: string;
    };
    mapEmbedUrl?: string;
}

interface ContactContextType {
    contactInfo: ContactInfo;
    updateContactInfo: (data: ContactInfo) => void;
}
// Связать с бд, на данный момент тестовые данныые
const ContactContext = createContext<ContactContextType | undefined>(undefined);

const initialContactInfo: ContactInfo = {
    companyName: 'IT Solutions',
    address: 'г. Москва, ул. Примерная, д. 123',
    phone: '+7 (999) 123-45-67',
    email: 'InfiniteleadersTech@yandex.ru',
    workingHours: 'Пн-Пт: 9:00-18:00, Сб-Вс: выходной',
    socialLinks: {
        telegram: 'https://t.me/InfiniteleadersTech',
        whatsapp: 'https://wa.me/79991234567'
    }
};

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);

    const updateContactInfo = (data: ContactInfo) => {
        setContactInfo(data);
        console.log('Contact data updated:', data);
    };

    return (
        <ContactContext.Provider value={{ contactInfo, updateContactInfo }}>
            {children}
        </ContactContext.Provider>
    );
};

export const useContact = () => {
    const context = useContext(ContactContext);
    if (context === undefined) {
        throw new Error('useContact must be used within a ContactProvider');
    }
    return context;
};