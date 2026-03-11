// src/components/admin/chat/ChatUserList.tsx

import React from 'react';
import type { ChatListItem } from '../../../types/chat';
import './ChatUserList.css';

interface ChatUserListProps {
    chats: ChatListItem[];
    selectedChatId: string | null;
    onSelectChat: (chat: ChatListItem) => void;
}

const ChatUserList: React.FC<ChatUserListProps> = ({
    chats,
    selectedChatId,
    onSelectChat
}) => {
    const formatTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (diffMins < 1440) return new Date(date).toLocaleDateString([], { day: 'numeric', month: 'short' });
        return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="chat-user-list">
            {chats.map(chat => (
                <div
                    key={chat.id}
                    onClick={() => onSelectChat(chat)}
                    className={`chat-item ${selectedChatId === chat.id ? 'selected' : ''}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectChat(chat);
                        }
                    }}
                >
                    <div className="user-avatar">
                        {chat.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="chat-content">
                        <div className="chat-header">
                            <span className="chat-name">{chat.userName}</span>
                            <span className="chat-time">{formatTime(chat.lastMessage?.timestamp || chat.createdAt)}</span>
                        </div>
                        <div className="chat-preview">
                            {chat.lastMessage ? (
                                <>
                                    {chat.lastMessage.sender === 'user' ? '' : 'Вы: '}
                                    {chat.lastMessage.text}
                                </>
                            ) : 'Нет сообщений'}
                        </div>
                    </div>
                    {chat.unreadCount > 0 && (
                        <div className="unread-badge">
                            {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChatUserList;