// src/pages/Shop/Shop.tsx
// src/pages/Shop/Shop.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../../context/ProductContext';
import './Shop.css';

// ==================== INTERFACES ====================

interface FilterState {
    category: string;
    sortBy: 'name' | 'price' | 'newest';
    searchQuery: string;
}

interface BuyModalProps {
    isOpen: boolean;
    productName: string;
    onClose: () => void;
    onBuyWithoutAuth: () => void;
    onBuyWithAuth: () => void;
}

interface GuestCheckoutFormProps {
    isOpen: boolean;
    productName: string;
    onClose: () => void;
    onSubmit: (data: GuestFormData) => void;
}

interface GuestFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    address?: string;
}

// ==================== BUY MODAL COMPONENT ====================

const BuyModal: React.FC<BuyModalProps> = ({
    isOpen,
    productName,
    onClose,
    onBuyWithoutAuth,
    onBuyWithAuth
}) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
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

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    <span className="icon-close"></span>
                </button>

                <div className="modal-header">
                    <h3 id="modal-title" className="modal-title">Оформление заказа</h3>
                    <p className="modal-subtitle">Товар: <strong>{productName}</strong></p>
                </div>

                <div className="modal-body">
                    <p className="modal-text">Выберите способ оформления:</p>

                    <div className="modal-options">
                        <button
                            type="button"
                            className="modal-option-btn modal-option-btn--guest"
                            onClick={onBuyWithoutAuth}
                        >
                            <span className="icon-guest"></span>
                            <span className="option-title">Без авторизации</span>
                            <span className="option-desc">Быстрое оформление по email</span>
                        </button>

                        <button
                            type="button"
                            className="modal-option-btn modal-option-btn--auth"
                            onClick={onBuyWithAuth}
                        >
                            <span className="icon-user"></span>
                            <span className="option-title">С авторизацией</span>
                            <span className="option-desc">Войти в личный кабинет</span>
                        </button>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="modal-cancel-btn"
                        onClick={onClose}
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==================== GUEST CHECKOUT FORM COMPONENT ====================

const GuestCheckoutForm: React.FC<GuestCheckoutFormProps> = ({
    isOpen,
    productName,
    onClose,
    onSubmit
}) => {
    const [formData, setFormData] = useState<GuestFormData>({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
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

        if (!formData.name.trim()) {
            newErrors.name = 'Введите имя';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Имя должно содержать минимум 2 символа';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Введите email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Введите адрес';
        } else if (formData.address.trim().length < 10) {
            newErrors.address = 'Адрес должен содержать минимум 10 символов';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }, [errors]);

    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        onSubmit(formData);
    }, [validateForm, onSubmit, formData]);

    const handleClose = useCallback(() => {
        setFormData({ name: '', email: '', phone: '', address: '' });
        setErrors({});
        setIsSubmitting(false);
        onClose();
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
            <div className="modal-content modal-content--form" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className="modal-close-btn"
                    onClick={handleClose}
                    aria-label="Закрыть"
                    disabled={isSubmitting}
                >
                    <span className="icon-close"></span>
                </button>

                <div className="modal-header">
                    <h3 id="form-modal-title" className="modal-title">Оформление заказа</h3>
                    <p className="modal-subtitle">Товар: <strong>{productName}</strong></p>
                </div>

                <div className="modal-body">
                    <form onSubmit={handleSubmit} className="checkout-form" noValidate>
                        <div className="form-group">
                            <label htmlFor="guest-name" className="form-label">
                                Имя <span className="required-mark">*</span>
                            </label>
                            <input
                                type="text"
                                id="guest-name"
                                name="name"
                                className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Иван Иванов"
                                disabled={isSubmitting}
                                autoComplete="name"
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? 'name-error' : undefined}
                            />
                            {errors.name && (
                                <span id="name-error" className="form-error" role="alert">
                                    <span className="icon-error"></span>
                                    {errors.name}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="guest-email" className="form-label">
                                Email <span className="required-mark">*</span>
                            </label>
                            <input
                                type="email"
                                id="guest-email"
                                name="email"
                                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="example@mail.ru"
                                disabled={isSubmitting}
                                autoComplete="email"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                            />
                            {errors.email && (
                                <span id="email-error" className="form-error" role="alert">
                                    <span className="icon-error"></span>
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="guest-phone" className="form-label">
                                Телефон <span className="optional-mark">(необязательно)</span>
                            </label>
                            <input
                                type="tel"
                                id="guest-phone"
                                name="phone"
                                className="form-input"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+7 (999) 000-00-00"
                                disabled={isSubmitting}
                                autoComplete="tel"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="guest-address" className="form-label">
                                Адрес доставки <span className="required-mark">*</span>
                            </label>
                            <textarea
                                id="guest-address"
                                name="address"
                                className={`form-textarea ${errors.address ? 'form-input--error' : ''}`}
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
                                disabled={isSubmitting}
                                rows={3}
                                autoComplete="street-address"
                                aria-invalid={!!errors.address}
                                aria-describedby={errors.address ? 'address-error' : undefined}
                            />
                            {errors.address && (
                                <span id="address-error" className="form-error" role="alert">
                                    <span className="icon-error"></span>
                                    {errors.address}
                                </span>
                            )}
                        </div>

                        <div className="form-note">
                            <span className="icon-info"></span>
                            <p>На указанный email придет подтверждение заказа</p>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="form-btn form-btn--secondary"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="form-btn form-btn--primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="icon-loading"></span>
                                        Оформление...
                                    </>
                                ) : (
                                    <>
                                        <span className="icon-submit"></span>
                                        Оформить заказ
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// ==================== MAIN SHOP COMPONENT ====================

const Shop: React.FC = () => {
    // ==================== MOUSE GRADIENT EFFECT ====================
    useEffect(() => {
        const shopPage = document.querySelector<HTMLElement>("[data-theme='light'] .shop-page");

        if (!shopPage) return;

        const handleMouseMove = (e: MouseEvent) => {
            // Обновляем CSS-переменные с координатами мыши
            shopPage.style.setProperty('--mouse-x', `${e.clientX}px`);
            shopPage.style.setProperty('--mouse-y', `${e.clientY}px`);
        };

        // Устанавливаем начальную позицию (центр)
        shopPage.style.setProperty('--mouse-x', '50%');
        shopPage.style.setProperty('--mouse-y', '50%');

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    const { state } = useProduct();
    const navigate = useNavigate();

    const [filters, setFilters] = useState<FilterState>({
        category: 'all',
        sortBy: 'newest',
        searchQuery: ''
    });

    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);
    const [isGuestFormOpen, setIsGuestFormOpen] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<string>('');

    const handleAddToCart = useCallback((productName: string) => {
        alert(`Товар "${productName}" добавлен в корзину!`);
    }, []);

    const handleQuickView = useCallback((product: any) => {
        alert(`Быстрый просмотр: ${product.name}\nЦена: ₽${product.price.toLocaleString()}\n${product.description}`);
    }, []);

    const handleBuyNow = useCallback((productName: string) => {
        setSelectedProduct(productName);
        setIsBuyModalOpen(true);
    }, []);

    const handleBuyWithoutAuth = useCallback(() => {
        setIsBuyModalOpen(false);
        setIsGuestFormOpen(true);
    }, []);

    const handleBuyWithAuth = useCallback(() => {
        // Переход на страницу авторизации с передачей данных о товаре
        navigate('/login', {
            state: {
                from: 'buy',
                productName: selectedProduct,
                redirectAfterLogin: '/checkout'
            }
        });
    }, [navigate, selectedProduct]);

    const handleGuestFormSubmit = useCallback((data: GuestFormData) => {
        alert(
            `✅ Заказ оформлен!\n\n` +
            `Товар: ${selectedProduct}\n` +
            `Имя: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Телефон: ${data.phone || 'Не указан'}\n` +
            `Адрес: ${data.address}\n\n` +
            `Подтверждение отправлено на ${data.email}`
        );
        setIsGuestFormOpen(false);
        setSelectedProduct('');
    }, [selectedProduct]);

    const handleCloseBuyModal = useCallback(() => {
        setIsBuyModalOpen(false);
    }, []);

    const handleCloseGuestForm = useCallback(() => {
        setIsGuestFormOpen(false);
    }, []);

    const handleFilterChange = useCallback(<K extends keyof FilterState>(
        key: K,
        value: FilterState[K]
    ) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const toggleFilters = useCallback(() => {
        setIsFiltersOpen(prev => !prev);
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            category: 'all',
            sortBy: 'newest',
            searchQuery: ''
        });
    }, []);

    const filteredAndSortedProducts = useMemo(() => {
        return state.products
            .filter(product => product.isActive && product.inStock)
            .filter(product => {
                if (filters.searchQuery.trim()) {
                    const query = filters.searchQuery.toLowerCase();
                    const matchesName = product.name.toLowerCase().includes(query);
                    const matchesDescription = product.description.toLowerCase().includes(query);
                    const matchesCategory = product.category.toLowerCase().includes(query);
                    if (!matchesName && !matchesDescription && !matchesCategory) {
                        return false;
                    }
                }
                if (filters.category !== 'all' && product.category !== filters.category) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => {
                switch (filters.sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name, 'ru');
                    case 'price':
                        return a.price - b.price;
                    case 'newest':
                    default:
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
            });
    }, [state.products, filters]);

    const categories = useMemo(() => {
        return ['all', ...new Set(state.products.map(product => product.category).filter(Boolean))];
    }, [state.products]);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.category !== 'all') count++;
        if (filters.sortBy !== 'newest') count++;
        if (filters.searchQuery.trim()) count++;
        return count;
    }, [filters]);

    return (
        <div className="shop-page">
            <div className="shop-container">
                {state.isLoading ? (
                    <div className="loading-section" role="status">
                        <div className="loading-spinner"></div>
                        <p>Загрузка товаров...</p>
                    </div>
                ) : state.error ? (
                    <div className="error-section" role="alert">
                        <h3>Произошла ошибка</h3>
                        <p>{state.error}</p>
                    </div>
                ) : (
                    <>
                        <div className="shop-controls">
                            <div className="search-wrapper">
                                <input
                                    type="search"
                                    id="search"
                                    className="search-input"
                                    placeholder="Поиск по названию, категории..."
                                    value={filters.searchQuery}
                                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                                    aria-label="Поиск товаров"
                                />
                                {filters.searchQuery && (
                                    <button
                                        type="button"
                                        className="search-clear-btn"
                                        onClick={() => handleFilterChange('searchQuery', '')}
                                        aria-label="Очистить поиск"
                                    />
                                )}
                            </div>

                            <button
                                type="button"
                                className="filters-toggle-btn"
                                onClick={toggleFilters}
                                aria-expanded={isFiltersOpen}
                                aria-controls="filters-panel"
                            >
                                <span className="icon-filters"></span>
                                Фильтры
                                {activeFiltersCount > 0 && (
                                    <span className="filters-badge">{activeFiltersCount}</span>
                                )}
                            </button>
                        </div>

                        <div
                            id="filters-panel"
                            className={`filters-panel ${isFiltersOpen ? 'filters-panel--open' : ''}`}
                        >
                            <div className="filters-content">
                                <div className="filter-group">
                                    <label htmlFor="category-filter">Категория:</label>
                                    <select
                                        id="category-filter"
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">Все категории</option>
                                        {categories
                                            .filter(cat => cat !== 'all')
                                            .map(category => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label htmlFor="sort-filter">Сортировка:</label>
                                    <select
                                        id="sort-filter"
                                        value={filters.sortBy}
                                        onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterState['sortBy'])}
                                        className="filter-select"
                                    >
                                        <option value="newest">Сначала новые</option>
                                        <option value="name">По названию</option>
                                        <option value="price">По цене: низкая → высокая</option>
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    className="filters-reset-btn"
                                    onClick={clearFilters}
                                    disabled={activeFiltersCount === 0}
                                >
                                    <span className="icon-reset"></span>
                                    Сбросить фильтры
                                </button>
                            </div>
                        </div>

                        <div className="products-meta">
                            <span>
                                Найдено: <strong>{filteredAndSortedProducts.length}</strong> товаров
                            </span>
                            {activeFiltersCount > 0 && (
                                <button
                                    className="quick-reset-link"
                                    onClick={clearFilters}
                                    type="button"
                                >
                                    Сбросить всё
                                </button>
                            )}
                        </div>

                        {filteredAndSortedProducts.length === 0 ? (
                            <div className="no-products" role="status">
                                <h3>Товары не найдены</h3>
                                <p>Попробуйте изменить параметры поиска или фильтрации</p>
                                {activeFiltersCount > 0 && (
                                    <button
                                        className="reset-filters-btn"
                                        onClick={clearFilters}
                                        type="button"
                                    >
                                        Сбросить фильтры
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="products-grid">
                                {filteredAndSortedProducts.map(product => (
                                    <article key={product.id} className="product-card">
                                        <div className="product-image">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                loading="lazy"
                                                width={300}
                                                height={200}
                                            />
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <div className="discount-badge">
                                                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                className="quick-view-btn"
                                                onClick={() => handleQuickView(product)}
                                                aria-label={`Быстрый просмотр: ${product.name}`}
                                            >
                                                <span className="icon-view"></span>
                                                Просмотр
                                            </button>
                                        </div>

                                        <div className="product-content">
                                            <div className="product-header">
                                                <h3 className="product-name">{product.name}</h3>
                                                <div className="product-prices">
                                                    <span className="product-price">
                                                        ₽{product.price.toLocaleString('ru-RU')}
                                                    </span>
                                                    {product.originalPrice && product.originalPrice > product.price && (
                                                        <span className="product-original-price">
                                                            ₽{product.originalPrice.toLocaleString('ru-RU')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="product-description">{product.description}</p>

                                            <div className="product-meta">
                                                <span className="product-category">{product.category}</span>
                                                <span className={`product-stock ${product.stockQuantity <= 5 ? 'product-stock--low' : ''}`}>
                                                    {product.stockQuantity > 5
                                                        ? 'В наличии'
                                                        : product.stockQuantity > 0
                                                            ? `Осталось ${product.stockQuantity} шт.`
                                                            : 'Нет в наличии'}
                                                </span>
                                            </div>

                                            <div className="product-features">
                                                {product.features.slice(0, 2).map((feature, index) => (
                                                    <span key={index} className="feature">{feature}</span>
                                                ))}
                                                {product.features.length > 2 && (
                                                    <span className="feature-more">
                                                        +{product.features.length - 2}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="product-tags">
                                                {product.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="product-tag">#{tag}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="product-actions">
                                            <button
                                                type="button"
                                                className="add-to-cart-btn"
                                                onClick={() => handleAddToCart(product.name)}
                                                disabled={!product.inStock}
                                                aria-disabled={!product.inStock}
                                            >
                                                <span className="icon-cart"></span>
                                                В корзину
                                            </button>

                                            <button
                                                type="button"
                                                className="buy-now-btn"
                                                onClick={() => handleBuyNow(product.name)}
                                                disabled={!product.inStock}
                                                aria-disabled={!product.inStock}
                                            >
                                                <span className="icon-buy"></span>
                                                Купить
                                            </button>

                                            <button
                                                type="button"
                                                className="wishlist-btn"
                                                onClick={() => alert(`Товар "${product.name}" добавлен в избранное`)}
                                                aria-label="Добавить в избранное"
                                            >
                                                <span className="icon-wishlist"></span>
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </>
                )}

                <section className="shop-cta">
                    <h2>Не нашли нужный товар?</h2>
                    <p>Свяжитесь с нами — мы поможем подобрать оптимальное решение</p>
                    <button
                        type="button"
                        className="cta-button"
                        onClick={() => alert('Форма связи будет открыта')}
                    >
                        <span className="icon-contact"></span>
                        Связаться с консультантом
                    </button>
                </section>

                {/* Модальное окно выбора способа покупки */}
                <BuyModal
                    isOpen={isBuyModalOpen}
                    productName={selectedProduct}
                    onClose={handleCloseBuyModal}
                    onBuyWithoutAuth={handleBuyWithoutAuth}
                    onBuyWithAuth={handleBuyWithAuth}
                />

                {/* Форма оформления без авторизации */}
                <GuestCheckoutForm
                    isOpen={isGuestFormOpen}
                    productName={selectedProduct}
                    onClose={handleCloseGuestForm}
                    onSubmit={handleGuestFormSubmit}
                />
            </div>
        </div>
    );
};

export default Shop;