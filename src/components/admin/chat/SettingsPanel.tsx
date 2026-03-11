import React, { useState, useEffect } from 'react';
import type { ChatFilter } from '../../../types/chat';
import './SettingsPanel.css'; // ← исправлено!

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    initialFilter?: ChatFilter;
    onFilterChange?: (filter: ChatFilter) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    isOpen,
    onClose,
    initialFilter,
    onFilterChange
}) => {
    const [filter, setFilter] = useState<ChatFilter>(initialFilter || {
        status: 'all',
        userType: 'all',
    });

    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            return savedTheme === 'dark' ||
                (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    const stats = {
        all: { count: 42, label: 'Все чаты', icon: '📋' },
        unauthorized: { count: 15, label: 'Гости', icon: '👤' },
        customer: { count: 18, label: 'Заказы', icon: '🛒' },
        question: { count: 7, label: 'Вопросы', icon: '❓' },
        team: { count: 2, label: 'Команда', icon: '👥' },
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        onFilterChange?.(filter);
    }, [filter, onFilterChange]);

    const handleThemeToggle = () => {
        const newTheme = !darkMode ? 'dark' : 'light';
        setDarkMode(!darkMode);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleApplyFilters = () => {
        onFilterChange?.(filter);
        onClose();
    };

    const handleResetFilters = () => {
        const resetFilter: ChatFilter = { status: 'all', userType: 'all' };
        setFilter(resetFilter);
        onFilterChange?.(resetFilter);
    };

    const handleStatClick = (userType: string) => {
        setFilter(prev => ({
            ...prev,
            userType: userType as ChatFilter['userType']
        }));
    };

    const statusOptions: Array<{ value: ChatFilter['status']; label: string }> = [
        { value: 'all', label: 'Все статусы' },
        { value: 'active', label: 'Активные' },
        { value: 'waiting', label: 'Ожидание' },
        { value: 'closed', label: 'Закрытые' },
    ];

    const userTypeOptions: Array<{ value: ChatFilter['userType']; label: string }> = [
        { value: 'all', label: 'Все типы' },
        { value: 'unauthorized', label: 'Гости' },
        { value: 'customer', label: 'Заказы' },
        { value: 'question', label: 'Вопросы' },
        { value: 'team', label: 'Команда' },
    ];

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter({
            ...filter,
            status: e.target.value as ChatFilter['status']
        });
    };

    const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter({
            ...filter,
            userType: e.target.value as ChatFilter['userType']
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className={`settings-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className={`settings-panel ${isOpen ? 'active' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-title"
            >
                <button
                    className="settings-close"
                    onClick={onClose}
                    aria-label="Закрыть настройки"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="settings-header">
                    <h3 className="settings-title" id="settings-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                        </svg>
                        Настройки чата
                    </h3>
                    <p className="settings-subtitle">Управление фильтрами и параметрами</p>
                </div>

                <div className="settings-content">
                    {/* Секция статистики */}
                    <div className="settings-section">
                        <h4 className="settings-section-title">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Статистика
                        </h4>
                        <div className="settings-stats">
                            {Object.entries(stats).map(([key, stat]) => (
                                <div
                                    key={key}
                                    className="settings-stat"
                                    onClick={() => handleStatClick(key)}
                                >
                                    <span className="settings-stat-icon">{stat.icon}</span>
                                    <span className="settings-stat-number">{stat.count}</span>
                                    <span className="settings-stat-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Секция фильтров */}
                    <div className="settings-section">
                        <h4 className="settings-section-title">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Фильтры чатов
                        </h4>
                        <div className="settings-filters">
                            <div className="settings-filter-group">
                                <label className="settings-filter-label" htmlFor="status-filter">
                                    Статус чата
                                </label>
                                <select
                                    id="status-filter"
                                    value={filter.status}
                                    onChange={handleStatusChange}
                                    className="settings-select"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="settings-filter-group">
                                <label className="settings-filter-label" htmlFor="type-filter">
                                    Тип пользователя
                                </label>
                                <select
                                    id="type-filter"
                                    value={filter.userType}
                                    onChange={handleUserTypeChange}
                                    className="settings-select"
                                >
                                    {userTypeOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="settings-buttons">
                                <button
                                    onClick={handleResetFilters}
                                    className="settings-button-small reset"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 12h6M12 9v6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Сбросить все
                                </button>
                                <button
                                    onClick={handleApplyFilters}
                                    className="settings-button-small apply"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Применить
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Секция внешнего вида */}
                    <div className="settings-section">
                        <h4 className="settings-section-title">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Внешний вид
                        </h4>
                        <div className="theme-switcher" onClick={handleThemeToggle} role="button" tabIndex={0}>
                            <div className="theme-label">
                                <svg className="theme-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    {darkMode ? (
                                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                                    ) : (
                                        <>
                                            <circle cx="12" cy="12" r="5" />
                                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                        </>
                                    )}
                                </svg>
                                {darkMode ? 'Темная тема' : 'Светлая тема'}
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={handleThemeToggle}
                                    aria-label="Переключить тему"
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    {/* Секция уведомлений */}
                    <div className="settings-section">
                        <h4 className="settings-section-title">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Уведомления
                        </h4>
                        <div className="notification-settings">
                            <div className="notification-item">
                                <span className="notification-label">Новые сообщения</span>
                                <label className="toggle-switch small">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="notification-item">
                                <span className="notification-label">Новые чаты</span>
                                <label className="toggle-switch small">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsPanel;