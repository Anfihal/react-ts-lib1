import React from 'react';
import ChatHeader from './ChatHeader';
import type { User, Message } from '../../../types/chat.types.ts';
import './ChatMain.css'; // ← подключаем CSS

interface ChatMainProps {
    currentUser: User;
    messages: Message[];
    onSendMessage: (message: string) => void;
    className?: string;
    theme?: 'light' | 'dark'; // ← добавляем тему
}

const ChatMain: React.FC<ChatMainProps> = ({
    currentUser,
    messages,
    onSendMessage,
    className = '',
    theme = 'light'
}) => {
    const [newMessage, setNewMessage] = React.useState('');

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

    return (
        <div className={`chat-main ${theme} ${className}`}>
            <ChatHeader
                user={currentUser}
                online={currentUser.online}
            // title больше не нужен — header сам отображает имя
            />

            <div className="chat-messages-container">
                {messages.length === 0 ? (
                    <div className="chat-empty">
                        Начните диалог с нашей поддержкой!
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`chat-message ${message.senderId === currentUser.id ? 'sent' : 'received'}`}
                        >
                            <div className="chat-message-content">
                                {message.content}
                            </div>
                            <div className="chat-message-time">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="chat-message-input">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Введите сообщение..."
                    className="chat-textarea"
                    rows={1}
                />
                <button
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="chat-send-button"
                >
                    Отправить
                </button>
            </div>
        </div>
    );
};

export default ChatMain;