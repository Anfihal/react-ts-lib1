// src/pages/Services/Services.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useService } from '../../context/ServiceContext';
import { useProfile } from '../../context/ProfileContext';
import ConsultationModal from '../../components/ConsultationModal/ConsultationModal';
import './Services.css';

// ==================== ТИПЫ ДЛЯ ФОРМЫ ГОСТЯ ====================
interface GuestOrderData {
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface GuestOrderFormProps {
    isOpen: boolean;
    serviceName: string;
    onClose: () => void;
    onSubmit: (data: GuestOrderData) => void;
}

interface FormErrors {
    name?: string;
    email?: string;
    address?: string;
}

// ==================== КОМПОНЕНТ ФОРМЫ ЗАКАЗА УСЛУГИ (ГОСТЬ) ====================
const GuestOrderForm: React.FC<GuestOrderFormProps> = ({
    isOpen,
    serviceName,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<GuestOrderData>({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            setFormData({ name: '', email: '', phone: '', address: '' });
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Введите имя';
        else if (formData.name.trim().length < 2) newErrors.name = 'Минимум 2 символа';

        if (!formData.email.trim()) newErrors.email = 'Введите email';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = 'Некорректный email';

        if (!formData.address.trim()) newErrors.address = 'Введите адрес';
        else if (formData.address.trim().length < 10)
            newErrors.address = 'Минимум 10 символов';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
            if (errors[name as keyof FormErrors]) {
                setErrors((prev) => ({ ...prev, [name]: undefined }));
            }
        },
        [errors]
    );

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            if (!validateForm()) return;
            setIsSubmitting(true);
            onSubmit(formData);
        },
        [validateForm, onSubmit, formData]
    );

    const handleClose = useCallback(() => {
        setFormData({ name: '', email: '', phone: '', address: '' });
        setErrors({});
        setIsSubmitting(false);
        onClose();
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose} role="dialog" aria-modal="true">
            <div className="modal-content modal-content--form" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={handleClose} disabled={isSubmitting}>
                    ✕
                </button>
                <div className="modal-header">
                    <h3>Заказ услуги</h3>
                    <p className="modal-subtitle">Услуга: <strong>{serviceName}</strong></p>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit} className="checkout-form" noValidate>
                        <div className="form-group">
                            <label>Имя <span className="required-mark">*</span></label>
                            <input
                                type="text"
                                name="name"
                                className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Иван Иванов"
                                disabled={isSubmitting}
                            />
                            {errors.name && <span className="form-error">{errors.name}</span>}
                        </div>
                        <div className="form-group">
                            <label>Email <span className="required-mark">*</span></label>
                            <input
                                type="email"
                                name="email"
                                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="example@mail.ru"
                                disabled={isSubmitting}
                            />
                            {errors.email && <span className="form-error">{errors.email}</span>}
                        </div>
                        <div className="form-group">
                            <label>Телефон <span className="optional-mark">(необязательно)</span></label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+7 (999) 000-00-00"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="form-group">
                            <label>Адрес <span className="required-mark">*</span></label>
                            <textarea
                                name="address"
                                className={`form-textarea ${errors.address ? 'form-input--error' : ''}`}
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="г. Москва, ул. Примерная, д. 1"
                                disabled={isSubmitting}
                                rows={3}
                            />
                            {errors.address && <span className="form-error">{errors.address}</span>}
                        </div>
                        <div className="form-actions">
                            <button type="button" className="form-btn form-btn--secondary" onClick={handleClose} disabled={isSubmitting}>
                                Отмена
                            </button>
                            <button type="submit" className="form-btn form-btn--primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Оформление...' : 'Заказать услугу'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// ==================== ОСНОВНОЙ КОМПОНЕНТ SERVICES ====================
const Services: React.FC = () => {
    // Эффект градиента мыши
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
    const { state: profileState } = useProfile();   // ← получаем состояние профиля
    const navigate = useNavigate();
    const isAuthenticated = !!profileState.profile;  // ← авторизован, если профиль загружен

    // Состояния для фильтров и модалок
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState('');
    const [isGuestOrderOpen, setIsGuestOrderOpen] = useState(false);

    // Категории
    const categories = useMemo(() => {
        const cats = state.services.map(s => s.category).filter(Boolean);
        return [...new Set(cats)].sort();
    }, [state.services]);

    // Фильтрация и сортировка
    const filteredAndSortedServices = useMemo(() => {
        let result = state.services.filter(service => {
            if (!service.isActive) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.trim().toLowerCase();
                const nameMatch = service.name.toLowerCase().includes(q);
                const descMatch = service.description.toLowerCase().includes(q);
                if (!nameMatch && !descMatch) return false;
            }
            if (selectedCategory !== 'all' && service.category !== selectedCategory) return false;
            return true;
        });

        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            default:
                result.sort((a, b) => {
                    if (a.createdAt && b.createdAt) {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    }
                    return (b.id || 0) - (a.id || 0);
                });
        }
        return result;
    }, [state.services, searchQuery, selectedCategory, sortBy]);

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('newest');
    };

    // Консультация
    const handleConsultation = (serviceName: string) => {
        setSelectedService(serviceName);
        setIsModalOpen(true);
    };

    // Заказ услуги (с проверкой авторизации через profileState.profile)
    const handleOrderService = useCallback((serviceName: string) => {
        setSelectedService(serviceName);
        if (isAuthenticated) {
            navigate('/checkout', { state: { serviceName, from: 'services' } });
        } else {
            setIsGuestOrderOpen(true);
        }
    }, [isAuthenticated, navigate]);

    // Отправка гостевой формы
    const handleGuestOrderSubmit = useCallback((data: GuestOrderData) => {
        const order = {
            id: Date.now(),
            serviceName: selectedService,
            customer: { ...data },
            date: new Date().toISOString(),
            status: 'pending',
            type: 'service',
        };
        const existingOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
        existingOrders.push(order);
        localStorage.setItem('guestOrders', JSON.stringify(existingOrders));

        alert(
            `✅ Заказ услуги оформлен!\n\n` +
            `Услуга: ${selectedService}\n` +
            `Имя: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Телефон: ${data.phone || 'Не указан'}\n` +
            `Адрес: ${data.address}\n\n` +
            `Номер заказа: ${order.id}\n` +
            `Подтверждение отправлено на ${data.email}`
        );
        setIsGuestOrderOpen(false);
        setSelectedService('');
    }, [selectedService]);

    const handleCloseGuestOrder = useCallback(() => {
        setIsGuestOrderOpen(false);
        setSelectedService('');
    }, []);

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
                        <div className="services-controls">
                            <div className="search-wrapper">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Поиск по услугам..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                                        ✕
                                    </button>
                                )}
                            </div>
                            <button
                                className={`filters-toggle-btn ${isFiltersOpen ? 'active' : ''}`}
                                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            >
                                Фильтры
                            </button>
                        </div>

                        <div className={`filters-panel ${isFiltersOpen ? 'filters-panel--open' : ''}`}>
                            <div className="filters-content">
                                <div className="filter-group">
                                    <label>Категория</label>
                                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                        <option value="all">Все категории</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label>Сортировка</label>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
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
                                    Сбросить
                                </button>
                            </div>
                        </div>

                        {filteredAndSortedServices.length === 0 ? (
                            <div className="no-services">
                                <h3>{state.services.length === 0 ? 'Услуги временно недоступны' : 'Ничего не найдено'}</h3>
                                <p>{state.services.length === 0 ? 'Пожалуйста, проверьте позже' : 'Попробуйте изменить параметры поиска'}</p>
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
                                                <span className="service-price">₽{service.price.toLocaleString()}</span>
                                            </div>
                                            <p className="service-description">{service.description}</p>
                                            <div className="service-meta">
                                                <span className="service-category">{service.category}</span>
                                                {service.duration && (
                                                    <span className="service-duration">{service.duration}</span>
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
                                                    className="order-btn"
                                                    onClick={() => handleOrderService(service.name)}
                                                >
                                                    Заказать услугу
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

            <ConsultationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                serviceName={selectedService}
            />

            <GuestOrderForm
                isOpen={isGuestOrderOpen}
                serviceName={selectedService}
                onClose={handleCloseGuestOrder}
                onSubmit={handleGuestOrderSubmit}
            />
        </div>
    );
};

export default Services;