// src/components/admin/chat/ChatSidebar.tsx

import React from 'react';
import ChatUserList from './ChatUserList';
import type { ChatListItem } from '../../../types/chat.types.ts';
import './ChatSidebar.css';

interface ChatSidebarProps {
    chats: ChatListItem[];
    selectedChatId: string | null;
    onSelectChat: (chat: ChatListItem) => void;
    theme?: 'light' | 'dark';
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    chats,
    selectedChatId,
    onSelectChat,
    theme = 'light'
}) => {
    const activeChats = chats.filter(chat => chat.status === 'active');
    const waitingChats = chats.filter(chat => chat.status === 'waiting');
    const closedChats = chats.filter(chat => chat.status === 'closed');

    const renderChatsSection = (title: string, chatList: ChatListItem[], icon: string) => {
        if (chatList.length === 0) return null;

        return (
            <div className="chats-section" key={title}>
                <div className="chats-section-header">
                    <div className="chats-section-title">
                        <span className="chats-section-icon">{icon}</span>
                        <span className="chats-section-name">{title}</span>
                        <span className="chats-section-count">{chatList.length}</span>
                    </div>
                </div>
                <ChatUserList
                    chats={chatList}
                    selectedChatId={selectedChatId}
                    onSelectChat={onSelectChat}
                />
            </div>
        );
    };

    return (
        <div className={`chat-sidebar ${theme}`}>
            {renderChatsSection('Активные чаты', activeChats, '💬')}
            {renderChatsSection('В ожидании', waitingChats, '⏳')}
            {renderChatsSection('Завершенные', closedChats, '✅')}

            {chats.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <h4 className="empty-state-title">Нет доступных чатов</h4>
                    <p className="empty-state-description">
                        Все чаты обработаны или отфильтрованы
                    </p>
                </div>
            )}
        </div>
    );
};

export default ChatSidebar;