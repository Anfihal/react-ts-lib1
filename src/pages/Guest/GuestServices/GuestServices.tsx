// src/pages/Services/Services.tsx
import React, { useEffect } from 'react';
import { useService } from '../../../context/ServiceContext';

const Services: React.FC = () => {
    const { state } = useService();
    // ==================== MOUSE GRADIENT EFFECT ====================
    useEffect(() => {
        const servicesPage = document.querySelector<HTMLElement>(".services-page");
        if (!servicesPage) return;

        const handleMouseMove = (e: MouseEvent) => {
            servicesPage.style.setProperty('--mouse-x', `${e.clientX}px`);
            servicesPage.style.setProperty('--mouse-y', `${e.clientY}px`);
        };

        // Начальная позиция — центр
        servicesPage.style.setProperty('--mouse-x', '50%');
        servicesPage.style.setProperty('--mouse-y', '50%');

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    const handleConsultation = (serviceName: string) => {
        alert(`Запрос на консультацию по услуге: ${serviceName}`);
    };

    const handleDetails = (serviceName: string) => {
        alert(`Заказать: ${serviceName}`);
    };

    return (
        <div className="services-page">
            <div className="glass-overlay"></div>
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

                        {state.services.length === 0 ? (
                            <div className="no-services">
                                <h3>Услуги временно недоступны</h3>
                                <p>Пожалуйста, проверьте позже</p>
                            </div>
                        ) : (
                            <div className="services-grid">
                                {state.services
                                    .filter(service => service.isActive)
                                    .map(service => (
                                        <div key={service.id} className="service-card">
                                            {service.imageUrl && (
                                                <div className="service-image">
                                                    <img
                                                        src={service.imageUrl}
                                                        alt={service.name}
                                                        loading="lazy"
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
                                                {/* Только кнопки для пользователей - без редактирования! */}
                                                <div className="service-actions">
                                                    <button
                                                        className="consult-btn"
                                                        onClick={() => handleConsultation(service.name)}
                                                    >
                                                        Получить консультацию
                                                    </button>
                                                    <button
                                                        className="details-btn"
                                                        onClick={() => handleDetails(service.name)}
                                                    >
                                                        Заказать
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
                    <button className="cta-button" onClick={() => handleConsultation('индивидуальное решение')}>
                        Обсудить проект
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Services;