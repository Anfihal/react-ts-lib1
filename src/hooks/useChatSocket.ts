import { useEffect, useRef, useState } from 'react';
import type { Message, User } from '../types/chat.types';

interface UseChatSocketProps {
    url: string;
    userId: string;
    onMessage: (message: Message) => void;
    onUserUpdate: (user: User) => void;
}

export const useChatSocket = ({
    url,
    userId,
    onMessage,
    onUserUpdate
}: UseChatSocketProps) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const connect = () => {
            try {
                const socket = new WebSocket(url);

                socket.onopen = () => {
                    setIsConnected(true);
                    setError(null);
                    socket.send(JSON.stringify({
                        type: 'identify',
                        userId
                    }));
                };

                socket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        switch (data.type) {
                            case 'message':
                                onMessage(data.message);
                                break;
                            case 'user_update':
                                onUserUpdate(data.user);
                                break;
                            case 'error':
                                setError(data.message);
                                break;
                            default:
                                console.warn('Unknown message type:', data.type);
                        }
                    } catch (err) {
                        console.error('Error parsing message:', err);
                    }
                };

                socket.onerror = (error) => {
                    setError('WebSocket error');
                    console.error('WebSocket error:', error);
                };

                socket.onclose = () => {
                    setIsConnected(false);
                    setTimeout(connect, 3000);
                };

                socketRef.current = socket;
            } catch (err) {
                setError('Failed to connect');
                console.error('Connection error:', err);
            }
        };

        connect();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [url, userId, onMessage, onUserUpdate]);

    const sendMessage = (chatId: string, content: string) => {
        if (socketRef.current && isConnected) {
            socketRef.current.send(JSON.stringify({
                type: 'message',
                chatId,
                content
            }));
        }
    };

    return {
        isConnected,
        error,
        sendMessage
    };
};