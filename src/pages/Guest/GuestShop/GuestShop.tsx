// src/pages/Guest/GuestShop/GuestShop.tsx
// src/pages/Guest/GuestShop/GuestShop.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useProduct } from '../../../context/ProductContext';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../../Shop/Shop.css'; // Import glass styles from main Shop folder

const GuestShop: React.FC = () => {
    const { state } = useProduct();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('newest');
    const [showCartNotification, setShowCartNotification] = useState<boolean>(false);
    const [addedProductName, setAddedProductName] = useState<string>('');

    // ==================== MOUSE GRADIENT EFFECT ====================
    // ✅ Фикс: универсальный селектор для работы в light/dark темах
    useEffect(() => {
        const shopPage = document.querySelector<HTMLElement>('.shop-page');
        if (!shopPage) return;

        const handleMouseMove = (e: MouseEvent) => {
            shopPage.style.setProperty('--mouse-x', `${e.clientX}px`);
            shopPage.style.setProperty('--mouse-y', `${e.clientY}px`);
        };

        shopPage.style.setProperty('--mouse-x', '50%');
        shopPage.style.setProperty('--mouse-y', '50%');

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // ✅ Выносим обработчики в useCallback
    const handleAddToCart = useCallback((product: any) => {
        try {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                type: 'product' as const,
                imageUrl: product.imageUrl,
                inStock: product.inStock,
                stockQuantity: product.stockQuantity
            });

            setAddedProductName(product.name);
            setShowCartNotification(true);
            setTimeout(() => setShowCartNotification(false), 3000);
        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            alert('Произошла ошибка при добавлении товара в корзину');
        }
    }, [addToCart]);

    const handleBuyNow = useCallback((product: any) => {
        try {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                type: 'product' as const,
                imageUrl: product.imageUrl,
                inStock: product.inStock,
                stockQuantity: product.stockQuantity
            });
            navigate('/guest/checkout');
        } catch (error) {
            console.error('Ошибка при покупке:', error);
            alert('Произошла ошибка при оформлении покупки');
        }
    }, [addToCart, navigate]);

    const handleQuickView = useCallback((product: any) => {
        alert(`Быстрый просмотр: ${product.name}\nЦена: ₽${product.price.toLocaleString('ru-RU')}\n${product.description}`);
    }, []);

    const handleViewCart = useCallback(() => {
        navigate('/guest/cart');
        setShowCartNotification(false);
    }, [navigate]);

    // ✅ Фильтрация и сортировка
    const filteredAndSortedProducts = state.products
        .filter(product => product.isActive && product.inStock)
        .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
        .sort((a, b) => {
            switch (sortBy) {
                case 'name': return a.name.localeCompare(b.name, 'ru');
                case 'price': return a.price - b.price;
                case 'newest':
                default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

    const categories = ['all', ...new Set(state.products.map(p => p.category))];

    return (
        <div className="shop-page">
            {/* Уведомление о добавлении в корзину */}
            {showCartNotification && (
                <div className="cart-notification">
                    <div className="notification-content">
                        <div className="notification-text">
                            <strong>Товар добавлен в корзину!</strong>
                            <p>{addedProductName}</p>
                        </div>
                        <button className="view-cart-btn" onClick={handleViewCart}>
                            Перейти в корзину
                        </button>
                        <button
                            className="notification-close"
                            onClick={() => setShowCartNotification(false)}
                            aria-label="Закрыть уведомление"
                        />
                    </div>
                </div>
            )}

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
                        {/* ✅ Панель управления: поиск + фильтры */}
                        <div className="shop-controls">
                            {/* Поиск с иконкой */}
                            <div className="search-wrapper">
                                <input
                                    type="search"
                                    className="search-input"
                                    placeholder="Поиск по названию, категории..."
                                    aria-label="Поиск товаров"
                                />
                                {/* Кнопка очистки (появится при вводе, если добавить логику) */}
                            </div>

                            {/* Кнопка фильтров (для мобильной версии) */}
                            <button
                                type="button"
                                className="filters-toggle-btn"
                                aria-label="Открыть фильтры"
                            >
                                <span className="icon-filters"></span>
                                Фильтры
                            </button>
                        </div>

                        {/* ✅ Панель фильтров со стилями */}
                        <div className="filters-panel filters-panel--open">
                            <div className="filters-content">
                                <div className="filter-group">
                                    <label htmlFor="category">Категория:</label>
                                    {/* ✅ Добавлен класс filter-select для стилей */}
                                    <select
                                        id="category"
                                        className="filter-select"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="all">Все категории</option>
                                        {categories.filter(cat => cat !== 'all').map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label htmlFor="sort">Сортировка:</label>
                                    {/* ✅ Добавлен класс filter-select для стилей */}
                                    <select
                                        id="sort"
                                        className="filter-select"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                    >
                                        <option value="newest">Сначала новые</option>
                                        <option value="name">По названию</option>
                                        <option value="price">По цене (возрастание)</option>
                                    </select>
                                </div>

                                {/* Кнопка сброса с иконкой */}
                                <button
                                    type="button"
                                    className="filters-reset-btn"
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSortBy('newest');
                                    }}
                                >
                                    <span className="icon-reset"></span>
                                    Сбросить
                                </button>
                            </div>
                        </div>

                        {/* Мета-информация */}
                        <div className="products-meta">
                            <span>Найдено: <strong>{filteredAndSortedProducts.length}</strong> товаров</span>
                        </div>

                        {filteredAndSortedProducts.length === 0 ? (
                            <div className="no-products" role="status">
                                <h3>Товары не найдены</h3>
                                <p>Попробуйте изменить параметры фильтрации</p>
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
                                            {/* ✅ Кнопка быстрого просмотра с иконкой */}
                                            <button
                                                type="button"
                                                className="quick-view-btn"
                                                onClick={() => handleQuickView(product)}
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
                                                <span className="product-stock">
                                                    {product.stockQuantity > 5 ? 'В наличии' :
                                                        product.stockQuantity > 0 ? `Осталось ${product.stockQuantity} шт.` :
                                                            'Нет в наличии'}
                                                </span>
                                            </div>

                                            {/* ✅ Кнопки действий с иконками */}
                                            <div className="product-actions">
                                                <button
                                                    type="button"
                                                    className="add-to-cart-btn"
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={!product.inStock}
                                                >
                                                    <span className="icon-cart"></span>
                                                    В корзину
                                                </button>
                                                <button
                                                    type="button"
                                                    className="buy-now-btn"
                                                    onClick={() => handleBuyNow(product)}
                                                    disabled={!product.inStock}
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
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ✅ CTA секция с иконкой */}
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
            </div>
        </div>
    );
};

export default GuestShop;