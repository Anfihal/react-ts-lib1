import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ChatState, Message, User, Chat } from '../types/chat.types';

interface ChatContextType {
    chatState: ChatState;
    sendMessage: (chatId: string, content: string) => void;
    selectChat: (chatId: string) => void;
    markAsRead: (chatId: string) => void;
    addUser: (user: User) => void;
    updateUserStatus: (userId: string, online: boolean) => void;
    isInitialized: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within ChatProvider');
    }
    return context;
};

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [chatState, setChatState] = useState<ChatState>({
        chats: [],
        messages: [],
        users: [],
        loading: false
    });

    // Инициализация с задержкой для предотвращения ошибок
    useEffect(() => {
        const timer = setTimeout(() => {
            const initialUsers: User[] = [
                {
                    id: 'admin-1',
                    name: 'Администратор',
                    email: 'admin@example.com',
                    role: 'admin',
                    online: true
                },
                {
                    id: 'user-1',
                    name: 'Иван Иванов',
                    email: 'ivan@example.com',
                    role: 'user',
                    online: true
                },
                {
                    id: 'user-2',
                    name: 'Мария Петрова',
                    email: 'maria@example.com',
                    role: 'user',
                    online: false,
                    lastSeen: new Date()
                },
                {
                    id: 'guest-1',
                    name: 'Гость Сергей',
                    email: '',
                    role: 'guest',
                    online: true
                }
            ];

            const initialMessages: Message[] = [
                {
                    id: '1',
                    senderId: 'user-1',
                    receiverId: 'admin-1',
                    content: 'Здравствуйте! У меня есть вопрос по заказу',
                    timestamp: new Date(Date.now() - 3600000),
                    read: true,
                    chatId: 'chat-user-1'
                },
                {
                    id: '2',
                    senderId: 'admin-1',
                    receiverId: 'user-1',
                    content: 'Добрый день! Чем могу помочь?',
                    timestamp: new Date(Date.now() - 3500000),
                    read: true,
                    chatId: 'chat-user-1'
                },
                {
                    id: '3',
                    senderId: 'user-2',
                    receiverId: 'admin-1',
                    content: 'Когда будет доставка?',
                    timestamp: new Date(Date.now() - 1800000),
                    read: false,
                    chatId: 'chat-user-2'
                }
            ];

            const initialChats: Chat[] = [
                {
                    id: 'chat-user-1',
                    name: 'Иван Иванов',
                    participants: ['admin-1', 'user-1'],
                    lastMessage: initialMessages[1],
                    unreadCount: 0,
                    type: 'private',
                    createdAt: new Date(Date.now() - 86400000),
                    updatedAt: new Date(Date.now() - 3500000)
                },
                {
                    id: 'chat-user-2',
                    name: 'Мария Петрова',
                    participants: ['admin-1', 'user-2'],
                    lastMessage: initialMessages[2],
                    unreadCount: 1,
                    type: 'private',
                    createdAt: new Date(Date.now() - 43200000),
                    updatedAt: new Date(Date.now() - 1800000)
                }
            ];

            setChatState({
                chats: initialChats,
                messages: initialMessages,
                users: initialUsers,
                loading: false
            });
            setIsInitialized(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const sendMessage = useCallback((chatId: string, content: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: 'admin-1',
            content,
            timestamp: new Date(),
            read: false,
            chatId
        };

        setChatState(prev => ({
            ...prev,
            messages: [...(prev.messages || []), newMessage],
            chats: (prev.chats || []).map(chat =>
                chat.id === chatId
                    ? {
                        ...chat,
                        lastMessage: newMessage,
                        unreadCount: chat.unreadCount + 1,
                        updatedAt: new Date()
                    }
                    : chat
            )
        }));
    }, []);

    const selectChat = useCallback((chatId: string) => {
        setChatState(prev => ({
            ...prev,
            currentChatId: chatId
        }));
        markAsRead(chatId);
    }, []);

    const markAsRead = useCallback((chatId: string) => {
        setChatState(prev => ({
            ...prev,
            messages: (prev.messages || []).map(msg =>
                msg.chatId === chatId ? { ...msg, read: true } : msg
            ),
            chats: (prev.chats || []).map(chat =>
                chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
            )
        }));
    }, []);

    const addUser = useCallback((user: User) => {
        setChatState(prev => ({
            ...prev,
            users: [...(prev.users || []).filter(u => u.id !== user.id), user]
        }));
    }, []);

    const updateUserStatus = useCallback((userId: string, online: boolean) => {
        setChatState(prev => ({
            ...prev,
            users: (prev.users || []).map(user =>
                user.id === userId ? { ...user, online, lastSeen: new Date() } : user
            )
        }));
    }, []);

    const value: ChatContextType = {
        chatState,
        sendMessage,
        selectChat,
        markAsRead,
        addUser,
        updateUserStatus,
        isInitialized
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};