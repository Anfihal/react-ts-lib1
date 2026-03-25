// types/chat.types.ts
// src/types/chat.types.ts

// === Пользователи ===
export interface User {
    id: string;
    name: string;
    email: string;          // обязателен, т.к. используется в коде
    avatar?: string;
    role: 'admin' | 'user' | 'guest';
    online: boolean;
    lastSeen?: Date;
}

// === Агенты поддержки ===
export interface SupportAgent {
    id: string;
    name: string;
    department?: string;
    online: boolean;
    currentChats: number;
    maxChats: number;
}

// === Вложения ===
export interface Attachment {
    id: string;
    filename: string;
    url: string;
    type: 'image' | 'file' | 'video';
    size: number;
}

// === Сообщения ===
export interface Message {
    id: string;
    senderId: string;
    receiverId?: string;
    content: string;
    timestamp: Date;
    read: boolean;
    chatId: string;
    attachments?: Attachment[];
}

// === Чат для основного контекста (ChatContext) ===
export interface Chat {
    id: string;
    name: string;                      // обязательно, т.к. в админке ожидается
    participants: string[];            // обязательно
    lastMessage?: Message;
    unreadCount: number;
    type: 'private' | 'group' | 'support';
    createdAt: Date;
    updatedAt: Date;
    users?: User[];                    // опционально, для расширения
    messages?: Message[];              // опционально
}

// === Состояние чата ===
export interface ChatState {
    chats: Chat[];
    currentChatId?: string;
    messages: Message[];
    users: User[];
    loading: boolean;
    error?: string;
}

// === Комнаты для админского контекста (AdminChatContext) ===
export interface AdminChatRoom {
    id: string;
    name: string;
    description?: string;
    participants: User[];
    messages: Message[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// === Элемент списка чатов (для ChatSidebar) ===
export interface ChatListItem {
    id: string;
    userId: string;
    userName: string;
    userType: 'unauthorized' | 'customer' | 'question' | 'team';
    status: 'active' | 'waiting' | 'closed' | 'archived';
    unreadCount: number;
    lastMessage?: ChatMessage;
    createdAt: Date;
    tags?: string[];
    orderId?: string;
    serviceId?: string;
    assignedTo?: string;
    priority?: 'low' | 'medium' | 'high';
}

// === Сообщение для списка чатов ===
export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'consultant';
    timestamp: Date;
    isRead: boolean;
    attachments?: Array<{
        id: string;
        name: string;
        type: string;
        size: number;
        url?: string;
    }>;
}

// === Фильтры ===
export interface ChatFilter {
    status: 'all' | 'active' | 'waiting' | 'closed' | 'archived';
    userType: 'all' | 'unauthorized' | 'customer' | 'question' | 'team';
    search?: string;
    priority?: 'all' | 'low' | 'medium' | 'high';
    assigned?: 'all' | 'me' | 'unassigned';
}