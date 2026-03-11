import React, { useState, useRef } from 'react';
import './ChatInput.css'; // ← изменено

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: (text: string) => void;
    onFileUpload: (file: File) => void;
    disabled?: boolean;
    theme?: 'light' | 'dark'; // ← добавлено
}

const ChatInput: React.FC<ChatInputProps> = ({
    value,
    onChange,
    onSend,
    onFileUpload,
    disabled = false,
    theme = 'light', // ← по умолчанию
}) => {
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim() && !disabled) {
            onSend(value);
            onChange('');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => onFileUpload(file));
        setAttachments(prev => [...prev, ...files]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <form
            className={`chat-input-form ${theme}`} // ← передаём тему
            onSubmit={handleSubmit}
        >
            {attachments.length > 0 && (
                <div className="attachments-preview">
                    {attachments.map((file, index) => (
                        <div key={index} className="attachment-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                            </svg>
                            <span className="attachment-name">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="remove-attachment"
                                aria-label="Удалить вложение"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="input-row">
                <div className="input-actions">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="input-action-button"
                        title="Прикрепить файл"
                        disabled={disabled}
                        aria-label="Прикрепить файл"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="input-action-button"
                        title="Шаблоны ответов"
                        disabled={disabled}
                        aria-label="Шаблоны ответов"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                        </svg>
                    </button>
                </div>

                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Введите сообщение..."
                    disabled={disabled}
                    className="chat-textarea"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                />

                <button
                    type="submit"
                    disabled={!value.trim() || disabled}
                    className="send-button"
                    title="Отправить сообщение"
                    aria-label="Отправить сообщение"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                </button>
            </div>

            <div className="input-info">
                <span>Максимум 2000 символов</span>
                <span>{value.length}/2000</span>
            </div>
        </form>
    );
};

export default ChatInput;