import React from 'react';
import type { User } from '../../../types/chat';
import './ChatHeader.css'; // ← добавлено

interface ChatHeaderProps {
    user?: User;
    title?: string;
    online?: boolean;
    onClose?: () => void;
    onMinimize?: () => void;
    theme?: 'light' | 'dark'; // ← добавлено
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    user,
    title,
    online = false,
    onClose,
    onMinimize,
    theme = 'light'
}) => {
    const initial = user?.name?.trim()?.[0]?.toUpperCase() || '?';

    return (
        <div className={`chat-widget-header ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="header-left">
                {user ? (
                    <div className="chat-user-info">
                        <div className={`chat-user-avatar ${online ? 'online' : ''}`}>
                            {initial}
                        </div>
                        <div className="chat-user-details">
                            <span className="chat-user-name">{user.name}</span>
                            <span className="chat-user-status">
                                {online ? 'В сети' : 'Не в сети'}
                            </span>
                        </div>
                    </div>
                ) : title ? (
                    <h3>{title}</h3>
                ) : null}
            </div>

            <div className="header-actions">
                {onMinimize && (
                    <button
                        className="chat-action-btn minimize"
                        onClick={onMinimize}
                        aria-label="Свернуть"
                    >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <rect x="0" y="5" width="12" height="2" rx="1" />
                        </svg>
                    </button>
                )}
                {onClose && (
                    <button
                        className="chat-action-btn close"
                        onClick={onClose}
                        aria-label="Закрыть чат"
                    >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <line x1="1" y1="1" x2="11" y2="11" strokeWidth="2" />
                            <line x1="1" y1="11" x2="11" y2="1" strokeWidth="2" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChatHeader;