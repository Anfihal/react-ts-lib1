import React, { useState, useEffect, useMemo } from 'react';
import { useService } from '../../context/ServiceContext';
import ConsultationModal from '../../components/ConsultationModal/ConsultationModal';
import './Services.css';

const Services: React.FC = () => {
    // ==================== MOUSE GRADIENT EFFECT ====================
    useEffect(() => {
        const servicesPage = document.querySelector<HTMLElement>(".services-page");
        if (!servicesPage) return;

        const handleMouseMove = (e: MouseEvent) => {
            servicesPage.style.setProperty('--mouse-x', `${e.clientX}px`);
            servicesPage.style.setProperty('--mouse-y', `${e.clientY}px`);
        };

        servicesPage.style.setProperty('--mouse-x', '50%');
        servicesPage.style.setProperty('--mouse-y', '50%');

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const { state } = useService();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState('');

    // ==================== ФИЛЬТРАЦИЯ, ПОИСК И СОРТИРОВКА ====================
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

    // Состояние открытия панели фильтров (как в магазине)
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Уникальные категории
    const categories = useMemo(() => {
        const cats = state.services.map(s => s.category).filter(Boolean);
        return [...new Set(cats)].sort();
    }, [state.services]);

    // Применяем фильтры и сортировку
    const filteredAndSortedServices = useMemo(() => {
        let result = state.services.filter(service => {
            if (!service.isActive) return false;

            if (searchQuery.trim()) {
                const query = searchQuery.trim().toLowerCase();
                const nameMatch = service.name.toLowerCase().includes(query);
                const descMatch = service.description.toLowerCase().includes(query);
                if (!nameMatch && !descMatch) return false;
            }

            if (selectedCategory !== 'all' && service.category !== selectedCategory) {
                return false;
            }

            return true;
        });

        // Сортировка
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
            default:
                result.sort((a, b) => {
                    if (a.createdAt && b.createdAt) {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    }
                    return (b.id || 0) - (a.id || 0);
                });
                break;
        }

        return result;
    }, [state.services, searchQuery, selectedCategory, sortBy]);

    // Сброс всех фильтров
    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('newest');
    };

    const handleConsultation = (serviceName: string) => {
        setSelectedService(serviceName);
        setIsModalOpen(true);
    };

    const handleDetails = (serviceName: string) => {
        alert(`Подробнее об услуге: ${serviceName}`);
    };

    return (
        <div className="services-page">
            <div className="services-container">
                {state.isLoading ? (
                    <div className="loading-section">
                        <div className="loading-spinner"></div>
                        <p>Загрузка услуг...</p>
                    </div>
                ) : state.error ? (
                    <div className="error-section">
                        <h3>Произошла ошибка</h3>
                        <p>{state.error}</p>
                    </div>
                ) : (
                    <>
                        {/* Верхняя панель: Поиск + Кнопка Фильтров */}
                        <div className="services-controls">
                            <div className="search-wrapper">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Поиск по услугам..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Поиск услуг"
                                />
                                {searchQuery && (
                                    <button
                                        className="search-clear-btn"
                                        onClick={() => setSearchQuery('')}
                                        aria-label="Очистить поиск"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            <button
                                className={`filters-toggle-btn ${isFiltersOpen ? 'active' : ''}`}
                                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            >
                                <span className="icon-filters"></span>
                                Фильтры
                                {/* Можно добавить бейдж, если есть активные фильтры, опционально */}
                            </button>
                        </div>

                        {/* Выпадающая панель фильтров и сортировки */}
                        <div className={`filters-panel ${isFiltersOpen ? 'filters-panel--open' : ''}`}>
                            <div className="filters-content">
                                <div className="filter-group">
                                    <label>Категория</label>
                                    <select
                                        className="filter-select"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="all">Все категории</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label>Сортировка</label>
                                    <select
                                        className="filter-select"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                    >
                                        <option value="newest">Сначала новые</option>
                                        <option value="price-asc">Цена: по возрастанию</option>
                                        <option value="price-desc">Цена: по убыванию</option>
                                    </select>
                                </div>

                                <button
                                    className="filters-reset-btn"
                                    onClick={resetFilters}
                                    disabled={!searchQuery && selectedCategory === 'all' && sortBy === 'newest'}
                                >
                                    <span className="icon-reset"></span>
                                    Сбросить
                                </button>
                            </div>
                        </div>

                        {filteredAndSortedServices.length === 0 ? (
                            <div className="no-services">
                                <h3>
                                    {state.services.length === 0
                                        ? 'Услуги временно недоступны'
                                        : 'Ничего не найдено'}
                                </h3>
                                <p>
                                    {state.services.length === 0
                                        ? 'Пожалуйста, проверьте позже'
                                        : 'Попробуйте изменить параметры поиска'}
                                </p>
                            </div>
                        ) : (
                            <div className="services-grid">
                                {filteredAndSortedServices.map(service => (
                                    <div key={service.id} className="service-card">
                                        {service.imageUrl && (
                                            <div className="service-image">
                                                <img
                                                    src={service.imageUrl}
                                                    alt={service.name}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/images/service-placeholder.jpg';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="service-content">
                                            <div className="service-header">
                                                <h3 className="service-name">{service.name}</h3>
                                                <span className="service-price">
                                                    ₽{service.price.toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="service-description">
                                                {service.description}
                                            </p>
                                            <div className="service-meta">
                                                <span className="service-category">
                                                    {service.category}
                                                </span>
                                                {service.duration && (
                                                    <span className="service-duration">
                                                        {service.duration}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="service-actions">
                                                <button
                                                    className="consult-btn"
                                                    onClick={() => handleConsultation(service.name)}
                                                >
                                                    Консультация
                                                </button>
                                                <button
                                                    className="details-btn"
                                                    onClick={() => handleDetails(service.name)}
                                                >
                                                    Подробнее
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                <div className="services-cta">
                    <h2>Не нашли нужную услугу?</h2>
                    <p>Свяжитесь с нами для обсуждения индивидуального решения</p>
                    <button
                        className="cta-button"
                        onClick={() => handleConsultation('индивидуальное решение')}
                    >
                        Обсудить проект
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <ConsultationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    serviceName={selectedService}
                />
            )}
        </div>
    );
};

export default Services;