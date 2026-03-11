import React, { useState, useEffect, useRef } from 'react';
import type { Message, User } from '../../../types/chat';
import './AdminChat.css';

interface AdminChatProps {
    currentUser?: User;
    onSendMessage: (message: string) => void;
    messages?: Message[];
    selectedUserId?: string;
    theme?: 'light' | 'dark';
}

const AdminChat: React.FC<AdminChatProps> = ({
    currentUser,
    onSendMessage,
    messages = [],
    selectedUserId,
    theme = 'light'
}) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const safeCurrentUser = currentUser || {
        id: 'guest',
        name: 'Гость',
        email: '',
        role: 'guest' as const,
        online: true
    };

    const safeMessages = Array.isArray(messages) ? messages : [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [safeMessages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [newMessage]);

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredMessages = selectedUserId
        ? safeMessages.filter(
            msg =>
                (msg.senderId === safeCurrentUser.id && msg.receiverId === selectedUserId) ||
                (msg.senderId === selectedUserId && msg.receiverId === safeCurrentUser.id)
        )
        : safeMessages;

    const selectedUserName = selectedUserId
        ? `Пользователь ${selectedUserId}`
        : 'Общий чат';

    if (!safeCurrentUser) {
        return (
            <div className="admin-chat-error">
                <p>Ошибка: пользователь не определен</p>
            </div>
        );
    }

    return (
        <div className={`admin-chat ${theme === 'dark' ? 'dark-theme' : ''}`}>
            <div className="chat-messages-panel">
                <div className="chat-header">
                    <h3>{selectedUserName}</h3>

                    <div className="chat-header-actions">
                        <button className="header-btn" title="Информация">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                            </svg>
                        </button>
                        <button className="header-btn" title="Настройки">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="messages-container">
                    {filteredMessages.length === 0 ? (
                        <div className="empty-messages">
                            <p>Нет сообщений. Начните общение!</p>
                        </div>
                    ) : (
                        filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.senderId === safeCurrentUser.id ? 'sent' : 'received'}`}
                            >
                                <div className="message-content">
                                    {message.content}
                                </div>
                                <div className="message-time">
                                    {formatTime(message.timestamp)}
                                    {message.senderId === safeCurrentUser.id && (
                                        <span className="message-status">
                                            {message.read ? (
                                                <svg width="16" height="16" viewBox="0 0 16 15">
                                                    <path d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                                                    <path d="M15.898 2.488l-.423-.433a.365.365 0 0 0-.514-.006l-6.284 6.14a.32.32 0 0 1-.484-.033l-2.089-2.14a.365.365 0 0 0-.515-.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 16 15">
                                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                                                </svg>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="message-input">
                    <div className="message-input-container">
                        <button className="input-action-btn" title="Прикрепить файл">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                            </svg>
                        </button>

                        <textarea
                            ref={textareaRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Введите сообщение..."
                            rows={1}
                        />

                        <button className="input-action-btn" title="Эмодзи">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                            </svg>
                        </button>
                    </div>

                    <button
                        className="send-button"
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        title="Отправить"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminChat;