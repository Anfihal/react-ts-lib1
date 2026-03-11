import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatMain from './ChatMain';
import type { User, Message } from '../../../types/chat';
import './ChatWidget.css';

interface ChatWidgetProps {
    position?: 'bottom-right' | 'bottom-left';
    theme?: 'light' | 'dark';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
    position = 'bottom-right',
    theme = 'light'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const currentUser: User = {
        id: 'guest',
        name: 'Вы',
        email: '',
        role: 'guest',
        online: true
    };

    const SUPPORT_CHAT_ID = 'support-chat';

    const handleSend = (text: string) => {
        if (text.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                chatId: SUPPORT_CHAT_ID,
                content: text,
                senderId: currentUser.id,
                receiverId: 'support',
                timestamp: new Date(),
                read: false
            };
            setMessages(prev => [...prev, newMessage]);

            setTimeout(() => {
                const supportMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    chatId: SUPPORT_CHAT_ID,
                    content: 'Спасибо за ваше сообщение! Мы ответим вам в ближайшее время.',
                    senderId: 'support',
                    receiverId: currentUser.id,
                    timestamp: new Date(),
                    read: true
                };
                setMessages(prev => [...prev, supportMessage]);
            }, 1000);
        }
    };

    return (
        <div className={`chat-widget ${position} ${theme}`}>
            {!isOpen ? (
                <button
                    className="chat-toggle"
                    onClick={() => setIsOpen(true)}
                    aria-label="Открыть чат поддержки"
                >
                    💬
                </button>
            ) : (
                <div className={`chat-container ${isOpen ? 'open' : ''}`}>
                    <ChatHeader
                        user={currentUser}
                        online={true}
                        onClose={() => setIsOpen(false)}
                    />
                    <ChatMain
                        currentUser={currentUser}
                        messages={messages}
                        onSendMessage={handleSend}
                        theme={theme}
                    />
                </div>
            )}
        </div>
    );
};

export default ChatWidget;