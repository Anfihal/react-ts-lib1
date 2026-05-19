import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

    // Начальная позиция с проверкой на SSR
    const [position, setPosition] = useState(() => {
        if (typeof window === 'undefined') return { x: 0, y: 0 };
        return { x: window.innerWidth - 80, y: window.innerHeight - 100 };
    });

    // Флаг, указывающий, что нужно вернуть исходную позицию после закрытия
    const [shouldRestorePosition, setShouldRestorePosition] = useState(false);

    // Флаги для перетаскивания (используем ref для синхронности)
    const isPointerDownRef = useRef(false);
    const hasMovedRef = useRef(false);
    const dragOffsetRef = useRef({ x: 0, y: 0 });

    // Сохраняем исходную позицию перед сдвигом
    const originalPositionRef = useRef<{ x: number; y: number } | null>(null);

    // ---- ФИКСИРОВАННЫЙ РАДИУС ----
    const FIXED_RADIUS = 110;

    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Дебаунс для localStorage
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Список соцсетей
    const socialLinks: SocialLink[] = useMemo(() => {
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

    // Автоматический сдвиг при открытии, чтобы все иконки были видны,
    // при этом центральная кнопка всегда остаётся на экране.
    const applyAutoShift = useCallback(() => {
        if (!buttonRef.current || !menuRef.current) return;

        const btnRect = buttonRef.current.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;

        const itemSizeStr = getComputedStyle(document.documentElement).getPropertyValue('--item-size').trim();
        const itemSize = parseFloat(itemSizeStr) || 100;
        const halfItem = itemSize / 2;
        const padding = 15;

        const maxLeft = btnCenterX - FIXED_RADIUS - halfItem;
        const maxRight = btnCenterX + FIXED_RADIUS + halfItem;
        const maxTop = btnCenterY - FIXED_RADIUS - halfItem;
        const maxBottom = btnCenterY + FIXED_RADIUS + halfItem;

        let shiftX = 0;
        let shiftY = 0;

        if (maxLeft < padding) {
            shiftX = padding - maxLeft;
        } else if (maxRight > window.innerWidth - padding) {
            shiftX = (window.innerWidth - padding) - maxRight;
        }

        if (maxTop < padding) {
            shiftY = padding - maxTop;
        } else if (maxBottom > window.innerHeight - padding) {
            shiftY = (window.innerHeight - padding) - maxBottom;
        }

        // Ограничиваем, чтобы кнопка не ушла за экран
        const btnSize = 60;
        let newX = position.x + shiftX;
        let newY = position.y + shiftY;
        newX = Math.max(0, Math.min(newX, window.innerWidth - btnSize));
        newY = Math.max(0, Math.min(newY, window.innerHeight - btnSize));
        shiftX = newX - position.x;
        shiftY = newY - position.y;

        if (shiftX !== 0 || shiftY !== 0) {
            if (!originalPositionRef.current) {
                originalPositionRef.current = { ...position };
            }
            setPosition({
                x: newX,
                y: newY,
            });
            setShouldRestorePosition(true);
        } else {
            originalPositionRef.current = null;
            setShouldRestorePosition(false);
        }
    }, [position]);

    // Восстановление исходной позиции после закрытия меню
    const restorePosition = useCallback(() => {
        if (shouldRestorePosition && originalPositionRef.current) {
            setPosition(originalPositionRef.current);
            originalPositionRef.current = null;
            setShouldRestorePosition(false);
        }
    }, [shouldRestorePosition]);

    // Загрузка позиции из localStorage
    useEffect(() => {
        const saved = localStorage.getItem('magicShareMenuPos');
        if (saved) {
            try {
                const { x, y } = JSON.parse(saved);
                const maxX = window.innerWidth - 60;
                const maxY = window.innerHeight - 60;
                setPosition({
                    x: Math.min(Math.max(0, x), maxX),
                    y: Math.min(Math.max(0, y), maxY),
                });
            } catch { }
        }
    }, []);

    // Сохранение позиции с дебаунсом
    useEffect(() => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            localStorage.setItem('magicShareMenuPos', JSON.stringify(position));
        }, 200);
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, [position]);

    // При ресайзе, если меню открыто, пересчитываем автосдвиг
    useEffect(() => {
        const handleResize = () => {
            if (isOpen) applyAutoShift();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, applyAutoShift]);

    // Закрытие по клику вне меню
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                restorePosition();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, restorePosition]);

    // --- Перетаскивание (Pointer Events) ---
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (!buttonRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);

        const rect = buttonRef.current.getBoundingClientRect();
        dragOffsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        isPointerDownRef.current = true;
        hasMovedRef.current = false;
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isPointerDownRef.current) return;
        const btnRect = buttonRef.current?.getBoundingClientRect();
        if (!btnRect) return;

        const dx = Math.abs(e.clientX - btnRect.left - dragOffsetRef.current.x);
        const dy = Math.abs(e.clientY - btnRect.top - dragOffsetRef.current.y);
        if (dx > 3 || dy > 3) {
            hasMovedRef.current = true;
        }

        const btnSize = 60;
        const newX = e.clientX - dragOffsetRef.current.x;
        const newY = e.clientY - dragOffsetRef.current.y;
        const maxX = window.innerWidth - btnSize;
        const maxY = window.innerHeight - btnSize;

        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY)),
        });
    }, []);

    const handlePointerUp = useCallback(() => {
        isPointerDownRef.current = false;
    }, []);

    // Переключение меню с автосдвигом
    const toggleMenu = useCallback(() => {
        if (hasMovedRef.current) {
            hasMovedRef.current = false;
            return;
        }

        const newState = !isOpen;

        if (newState) {
            setIsOpen(true);
            setTimeout(() => {
                applyAutoShift();
            }, 0);
        } else {
            setIsOpen(false);
            restorePosition();
        }
    }, [isOpen, applyAutoShift, restorePosition]);

    const handleLinkClick = useCallback((url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
        setIsOpen(false);
        restorePosition();
    }, [restorePosition]);

    if (socialLinks.length === 0) return null;

    return (
        <div
            className="magic-share-menu"
            style={{
                left: position.x,
                top: position.y,
                '--total': socialLinks.length,
            } as React.CSSProperties}
            ref={menuRef}
        >
            <div
                className={`magic-menu ${isOpen ? 'open' : ''}`}
                style={{ '--radius': `${FIXED_RADIUS}px` } as React.CSSProperties}
            >
                {socialLinks.map((link, index) => (
                    <button
                        key={link.name}
                        className={`magic-menu-item ${link.icon}`}
                        style={{ '--i': index, '--total': socialLinks.length } as React.CSSProperties}
                        onClick={() => handleLinkClick(link.url)}
                        aria-label={link.name}
                    >
                        <span className="sr-only">{link.name}</span>
                    </button>
                ))}
            </div>

            <button
                ref={buttonRef}
                className={`magic-toggle ${isOpen ? 'active' : ''}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onClick={toggleMenu}
                aria-label="Меню социальных сетей"
            >
                <span className="magic-toggle-icon" />
            </button>
        </div>
    );
};

export default MagicShareMenu;