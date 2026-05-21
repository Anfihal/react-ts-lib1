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

    // ==================== ФИЛЬТРАЦИЯ И ПОИСК ====================
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Уникальные категории из всех услуг (активных и неактивных, чтобы фильтр был полным)
    const categories = useMemo(() => {
        const cats = state.services.map(s => s.category).filter(Boolean);
        return [...new Set(cats)].sort();
    }, [state.services]);

    // Применяем фильтры к активным услугам
    const filteredServices = useMemo(() => {
        return state.services.filter(service => {
            // Только активные
            if (!service.isActive) return false;

            // Поиск по названию и описанию
            if (searchQuery.trim()) {
                const query = searchQuery.trim().toLowerCase();
                const nameMatch = service.name.toLowerCase().includes(query);
                const descMatch = service.description.toLowerCase().includes(query);
                if (!nameMatch && !descMatch) return false;
            }

            // Фильтр по категории
            if (selectedCategory !== 'all' && service.category !== selectedCategory) {
                return false;
            }

            return true;
        });
    }, [state.services, searchQuery, selectedCategory]);

    const handleConsultation = (serviceName: string) => {
        console.log('Кнопка нажата:', serviceName);
        setSelectedService(serviceName);
        setIsModalOpen(true);
    };

    const handleDetails = (serviceName: string) => {
        alert(`Подробнее об услуге: ${serviceName}`);
    };

    console.log('Состояние модального окна:', isModalOpen);
    console.log('Выбранная услуга:', selectedService);

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
                        {/* Панель поиска и фильтров */}
                        <div className="services-toolbar">
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Поиск по услугам..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Поиск услуг"
                                />
                                {searchQuery && (
                                    <button
                                        className="clear-search"
                                        onClick={() => setSearchQuery('')}
                                        aria-label="Очистить поиск"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {categories.length > 0 && (
                                <div className="filter-category">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        aria-label="Фильтр по категории"
                                    >
                                        <option value="all">Все категории</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {filteredServices.length === 0 ? (
                            <div className="no-services">
                                <h3>
                                    {state.services.length === 0
                                        ? 'Услуги временно недоступны'
                                        : 'По вашему запросу ничего не найдено'}
                                </h3>
                                <p>
                                    {state.services.length === 0
                                        ? 'Пожалуйста, проверьте позже'
                                        : 'Попробуйте изменить параметры поиска'}
                                </p>
                            </div>
                        ) : (
                            <div className="services-grid">
                                {filteredServices.map(service => (
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
                                                    onClick={() => {
                                                        console.log('Кнопка кликнута для:', service.name);
                                                        handleConsultation(service.name);
                                                    }}
                                                >
                                                    Получить консультацию
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
                    onClose={() => {
                        console.log('Закрытие модального окна');
                        setIsModalOpen(false);
                    }}
                    serviceName={selectedService}
                />
            )}
        </div>
    );
};

export default Services;