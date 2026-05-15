import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useContact } from '../../context/ContactContext';
import './MagicShareMenu.css';

interface SocialLink {
    name: string;
    url: string;
    icon: string;
    order?: number;
}

const MagicShareMenu: React.FC = () => {
    const { state } = useContact();
    const [isOpen, setIsOpen] = useState(false);

    // Начальная позиция: правый нижний угол с отступом
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 100 });

    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Формируем список соцсетей
    const socialLinks: SocialLink[] = React.useMemo(() => {
        const contacts = state.contactInfo;
        if (!contacts?.socialLinks) return [];

        const sl = contacts.socialLinks;
        const links: SocialLink[] = [];

        if (sl.telegram) links.push({ name: 'Telegram', url: sl.telegram, icon: 'magic-icon--telegram', order: 1 });
        if (sl.whatsapp) links.push({ name: 'WhatsApp', url: sl.whatsapp, icon: 'magic-icon--whatsapp', order: 2 });
        if (sl.vk) links.push({ name: 'VK', url: sl.vk, icon: 'magic-icon--vk', order: 3 });
        if (sl.instagram) links.push({ name: 'Instagram', url: sl.instagram, icon: 'magic-icon--instagram', order: 4 });
        if (sl.odnoklassniki) links.push({ name: 'Одноклассники', url: sl.odnoklassniki, icon: 'magic-icon--odnoklassniki', order: 5 });
        if (sl.zen) links.push({ name: 'Дзен', url: sl.zen, icon: 'magic-icon--zen', order: 6 });
        if (contacts.email) links.push({ name: 'Email', url: `mailto:${contacts.email}`, icon: 'magic-icon--email', order: 7 });

        return links.sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [state.contactInfo]);

    // Загрузка сохранённой позиции
    useEffect(() => {
        const savedPos = localStorage.getItem('magicShareMenuPos');
        if (savedPos) {
            try {
                const { x, y } = JSON.parse(savedPos);
                // Проверка, чтобы загруженная позиция была в пределах экрана
                const maxX = window.innerWidth - 60;
                const maxY = window.innerHeight - 60;
                setPosition({
                    x: Math.min(Math.max(0, x), maxX),
                    y: Math.min(Math.max(0, y), maxY)
                });
            } catch (e) { }
        }
    }, []);

    // Сохранение позиции
    useEffect(() => {
        localStorage.setItem('magicShareMenuPos', JSON.stringify(position));
    }, [position]);

    // Перетаскивание
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
            e.preventDefault();
            const rect = buttonRef.current.getBoundingClientRect();
            setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setIsDragging(true);
        }
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();

        const btnSize = 60; // Примерный размер кнопки для расчета границ
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Ограничиваем позицию, чтобы кнопка не улетала за экран
        const maxX = window.innerWidth - btnSize;
        const maxY = window.innerHeight - btnSize;

        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        });
    }, [isDragging, dragOffset]);

    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const toggleMenu = () => {
        if (!isDragging) setIsOpen(!isOpen);
    };

    const handleLinkClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    if (socialLinks.length === 0) return null;

    return (
        <div
            className="magic-share-menu"
            style={{
                left: position.x,
                top: position.y,
                // Передаем переменные для адаптивности, если нужно контролировать их из JS
                '--total': socialLinks.length
            } as React.CSSProperties}
            ref={menuRef}
        >
            <div className={`magic-menu ${isOpen ? 'open' : ''}`}>
                {socialLinks.map((link, index) => (
                    <button
                        key={link.name}
                        className={`magic-menu-item ${link.icon}`}
                        style={{
                            '--i': index,
                            '--total': socialLinks.length
                        } as React.CSSProperties}
                        onClick={() => handleLinkClick(link.url)}
                        aria-label={link.name}
                        title={link.name}
                    />
                ))}
            </div>
            <button
                ref={buttonRef}
                className={`magic-toggle ${isOpen ? 'active' : ''}`}
                onMouseDown={handleMouseDown}
                onClick={toggleMenu}
                aria-label="Меню социальных сетей"
            >
                <span className="magic-toggle-icon" />
            </button>
        </div>
    );
};

export default MagicShareMenu;