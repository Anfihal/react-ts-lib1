// src/components/admin/chat/AdminChatLayout.tsx

// src/components/admin/chat/AdminChatLayout.tsx

import React, { useState, useEffect } from 'react';
import { useChat } from '../../../context/ChatContext';
import AdminChat from './AdminChat';
import ChatSidebar from './ChatSidebar';
import type { Chat, ChatListItem, User } from '../../../types/chat.types';
import './AdminChatLayout.css';

interface AdminChatLayoutProps {
    className?: string;
    theme?: 'light' | 'dark';
}

const AdminChatLayout: React.FC<AdminChatLayoutProps> = ({
    className = '',
    theme = 'light'
}) => {
    const { chatState, sendMessage } = useChat();
    const [selectedUserId, setSelectedUserId] = useState<string>();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSendMessage = (content: string) => {
        const chatId = selectedUserId ? `chat-${selectedUserId}` : 'general-chat';
        sendMessage(chatId, content);
    };

    const safeUsers = Array.isArray(chatState?.users) ? chatState.users : [];
    const safeMessages = Array.isArray(chatState?.messages) ? chatState.messages : [];
    const safeChats = Array.isArray(chatState?.chats) ? chatState.chats : [];

    const chatRooms: ChatListItem[] = safeChats.map((chat: Chat) => {
        const userParticipant = chat.participants?.find((id: string) => id !== 'admin-1') || 'unknown';

        const lastMessage = chat.lastMessage
            ? {
                id: chat.lastMessage.id,
                text: chat.lastMessage.content,
                sender: (chat.lastMessage.senderId === 'admin-1' ? 'consultant' : 'user') as 'consultant' | 'user',
                timestamp: chat.lastMessage.timestamp,
                isRead: chat.lastMessage.read,
                attachments: []
            }
            : undefined;

        return {
            id: chat.id,
            userId: userParticipant,
            userName: chat.name || 'Чат',
            userType: 'customer' as const,
            status: (chat.unreadCount ?? 0) > 0 ? 'active' as const : 'closed' as const,
            unreadCount: chat.unreadCount ?? 0,
            lastMessage,
            createdAt: chat.createdAt ?? new Date(),
            tags: [],
            orderId: undefined
        };
    });

    const filteredChats = chatRooms.filter((chat: ChatListItem) =>
        chat.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentUser = safeUsers.find((user: User) => user.id === 'admin-1') || {
        id: 'admin-1',
        name: 'Администратор',
        email: 'admin@example.com',
        role: 'admin',
        online: true
    };

    if (isLoading) {
        return (
            <div className="admin-chat-loading">
                <div className="loading-spinner"></div>
                <p>Загрузка чата...</p>
            </div>
        );
    }

    return (
        <div className={`admin-chat-layout ${className}`}>
            <div className="layout-header">
                <button
                    className="menu-toggle"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label="Открыть меню"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                    </svg>
                </button>
                <h2>Панель чата</h2>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Поиск пользователей..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="layout-content">
                <div className="admin-chat-wrapper">
                    <div className={`chat-sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
                        <ChatSidebar
                            chats={filteredChats}
                            selectedChatId={selectedUserId || null}
                            onSelectChat={(chat) => {
                                setSelectedUserId(chat.userId);
                                setIsSidebarOpen(false);
                            }}
                            theme={theme}
                        />
                    </div>

                    <div className="main-chat-area">
                        <AdminChat
                            currentUser={currentUser}
                            onSendMessage={handleSendMessage}
                            messages={safeMessages}
                            selectedUserId={selectedUserId}
                            theme={theme}
                        />
                    </div>
                </div>
            </div>

            <div className="layout-footer">
                <div className="stats">
                    <span>Пользователей: {safeUsers.length}</span>
                    <span>Сообщений: {safeMessages.length}</span>
                    <span>Активных чатов: {safeChats.filter((c: Chat) => (c.unreadCount ?? 0) > 0).length}</span>
                </div>
            </div>
        </div>
    );
};

export default AdminChatLayout;