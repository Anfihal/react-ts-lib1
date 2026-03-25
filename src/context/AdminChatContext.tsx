// src/context/AdminChatContext.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AdminChatRoom, User, Message } from '../types/chat'; // ← AdminChatRoom

interface AdminChatContextType {
    rooms: AdminChatRoom[];
    activeRoomId?: string;
    addRoom: (room: AdminChatRoom) => void;
    removeRoom: (roomId: string) => void;
    setActiveRoom: (roomId: string) => void;
    sendMessage: (roomId: string, content: string, senderId: string) => void;
    addUserToRoom: (roomId: string, user: User) => void;
}

const AdminChatContext = createContext<AdminChatContextType | undefined>(undefined);

export const useAdminChat = () => {
    const context = useContext(AdminChatContext);
    if (!context) {
        throw new Error('useAdminChat must be used within AdminChatProvider');
    }
    return context;
};

interface AdminChatProviderProps {
    children: ReactNode;
}

export const AdminChatProvider: React.FC<AdminChatProviderProps> = ({ children }) => {
    const [rooms, setRooms] = useState<AdminChatRoom[]>([
        {
            id: 'room-1',
            name: 'Общий чат',
            description: 'Общий чат поддержки',
            participants: [],
            messages: [],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);
    const [activeRoomId, setActiveRoomId] = useState<string>('room-1');

    const addRoom = useCallback((room: AdminChatRoom) => {
        setRooms(prev => [...prev, room]);
    }, []);

    const removeRoom = useCallback((roomId: string) => {
        setRooms(prev => prev.filter(room => room.id !== roomId));
        if (activeRoomId === roomId) {
            setActiveRoomId(rooms[0]?.id || '');
        }
    }, [activeRoomId, rooms]);

    const setActiveRoom = useCallback((roomId: string) => {
        setActiveRoomId(roomId);
        setRooms(prev => prev.map(room => ({
            ...room,
            isActive: room.id === roomId
        })));
    }, []);

    const sendMessage = useCallback((roomId: string, content: string, senderId: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            senderId,
            content,
            timestamp: new Date(),
            read: false,
            chatId: roomId
        };

        setRooms(prev => prev.map(room =>
            room.id === roomId
                ? {
                    ...room,
                    messages: [...room.messages, newMessage],
                    updatedAt: new Date()
                }
                : room
        ));
    }, []);

    const addUserToRoom = useCallback((roomId: string, user: User) => {
        setRooms(prev => prev.map(room =>
            room.id === roomId
                ? {
                    ...room,
                    participants: [...room.participants.filter((u: User) => u.id !== user.id), user],
                    updatedAt: new Date()
                }
                : room
        ));
    }, []);

    const value: AdminChatContextType = {
        rooms,
        activeRoomId,
        addRoom,
        removeRoom,
        setActiveRoom,
        sendMessage,
        addUserToRoom
    };

    return (
        <AdminChatContext.Provider value={value}>
            {children}
        </AdminChatContext.Provider>
    );
};