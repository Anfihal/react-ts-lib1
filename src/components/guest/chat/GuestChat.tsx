import React, { useState, useEffect, useRef } from 'react';
import type { Message, SupportAgent } from '../../../types/chat';
import './GuestChat.css';

interface GuestChatProps {
    guestId: string;
    guestName: string;
    messages: Message[];
    onSendMessage: (message: string) => void;
    supportAgents?: SupportAgent[];
}

const GuestChat: React.FC<GuestChatProps> = ({
    guestId,
    guestName,
    messages,
    onSendMessage,
    supportAgents
}) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isMinimized, setIsMinimized] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const onlineAgents = supportAgents?.filter(agent => agent.online) || [];

    if (isMinimized) {
        return (
            <div className="guest-chat-minimized">
                <button onClick={() => setIsMinimized(false)}>
                    💬 Чат поддержки ({messages.length})
                </button>
            </div>
        );
    }

    return (
        <div className="guest-chat">
            <div className="chat-header">
                <div className="header-left">
                    <h3>Чат поддержки</h3>
                    {onlineAgents.length > 0 && (
                        <span className="online-badge">
                            {onlineAgents.length} онлайн
                        </span>
                    )}
                </div>
                <div className="header-actions">
                    <button onClick={() => setIsMinimized(true)}>−</button>
                </div>
            </div>

            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <p>Напишите ваш вопрос, и мы ответим в ближайшее время</p>
                        <p>Среднее время ответа: 5 минут</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.senderId === guestId ? 'sent' : 'received'}`}
                        >
                            <div className="message-sender">
                                {message.senderId === guestId ? guestName : 'Поддержка'}
                            </div>
                            <div className="message-content">
                                {message.content}
                            </div>
                            <div className="message-time">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="message-input">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите ваш вопрос..."
                    rows={2}
                />
                <div className="input-actions">
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="send-button"
                    >
                        Отправить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuestChat;