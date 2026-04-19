import React, { useState, useEffect, useRef, useCallback } from 'react';
import './MagicShareMenu.css';

interface SocialLink {
    name: string;
    url: string;
    icon: string; // класс для иконки или SVG
}

const defaultSocialLinks: SocialLink[] = [
    {
        name: 'LinkedIn',
        url: 'https://linkedin.com/company/your-company',
        icon: 'magic-icon--linkedin'
    },
    {
        name: 'GitHub',
        url: 'https://github.com/your-company',
        icon: 'magic-icon--github'
    },
    {
        name: 'Telegram',
        url: 'https://t.me/your-company',
        icon: 'magic-icon--telegram'
    }
];

const MagicShareMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Загрузка сохранённой позиции
    useEffect(() => {
        const savedPos = localStorage.getItem('magicShareMenuPos');
        if (savedPos) {
            try {
                const { x, y } = JSON.parse(savedPos);
                setPosition({ x, y });
            } catch (e) {
                // fallback
            }
        } else {
            // Начальная позиция: правый край, по центру по вертикали
            setPosition({
                x: window.innerWidth - 80,
                y: window.innerHeight / 2 - 30
            });
        }
    }, []);

    // Сохранение позиции
    useEffect(() => {
        if (position.x !== 0 || position.y !== 0) {
            localStorage.setItem('magicShareMenuPos', JSON.stringify(position));
        }
    }, [position]);

    // Обработчики перетаскивания
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
            e.preventDefault();
            const rect = buttonRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            setIsDragging(true);
        }
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        // Ограничения, чтобы меню не уходило за пределы экрана
        const maxX = window.innerWidth - (buttonRef.current?.offsetWidth || 60);
        const maxY = window.innerHeight - (buttonRef.current?.offsetHeight || 60);
        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        });
    }, [isDragging, dragOffset]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

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
        if (!isDragging) {
            setIsOpen(!isOpen);
        }
    };

    const handleLinkClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            className="magic-share-menu"
            style={{ left: position.x, top: position.y }}
            ref={menuRef}
        >
            <div className={`magic-menu ${isOpen ? 'open' : ''}`}>
                {defaultSocialLinks.map((link, index) => (
                    <button
                        key={link.name}
                        className={`magic-menu-item ${link.icon}`}
                        style={{ '--i': index + 1 } as React.CSSProperties}
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
                <span className="magic-toggle-icon">+</span>
            </button>
        </div>
    );
};

export default MagicShareMenu;