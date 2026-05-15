// src/pages/Guest/GuestShop/GuestShop.tsx
// src/pages/Guest/GuestShop/GuestShop.tsx
import React, { useState, useEffect } from 'react';
import { useProduct } from '../../../context/ProductContext';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../../Shop/Shop.css';

const GuestShop: React.FC = () => {
    const { state } = useProduct();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Состояния фильтров
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('newest');
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

    // Состояние поиска
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Состояния корзины
    const [showCartNotification, setShowCartNotification] = useState<boolean>(false);
    const [addedProductName, setAddedProductName] = useState<string>('');

    // Состояние избранного (храним id товаров как строки для универсальности)
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // ==================== MOUSE GRADIENT EFFECT ====================
    useEffect(() => {
        const shopPage = document.querySelector<HTMLElement>(".shop-page");
        if (!shopPage) return;

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            shopPage.style.setProperty('--mouse-x', `${x}%`);
            shopPage.style.setProperty('--mouse-y', `${y}%`);
        };

        shopPage.style.setProperty('--mouse-x', '50%');
        shopPage.style.setProperty('--mouse-y', '50%');

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleAddToCart = (product: any) => {
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

            setTimeout(() => {
                setShowCartNotification(false);
            }, 3000);

        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            alert('Произошла ошибка при добавлении товара в корзину');
        }
    };

    const handleBuyNow = (product: any) => {
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
    };

    const handleQuickView = (product: any) => {
        alert(`Быстрый просмотр: ${product.name}\nЦена: ₽${product.price.toLocaleString()}\n${product.description}`);
    };

    const handleViewCart = () => {
        navigate('/guest/cart');
        setShowCartNotification(false);
    };

    // Переключение панели фильтров
    const toggleFilters = () => {
        setIsFiltersOpen(prev => !prev);
    };

    // Сброс фильтров
    const clearFilters = () => {
        setSelectedCategory('all');
        setSortBy('newest');
    };

    // Работа с избранным (id преобразуем к строке)
    const toggleFavorite = (productId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productId)) {
                newFavorites.delete(productId);
            } else {
                newFavorites.add(productId);
            }
            return newFavorites;
        });
    };

    // Фильтрация и сортировка товаров с учетом поиска
    const filteredAndSortedProducts = state.products
        .filter(product => product.isActive && product.inStock)
        .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
        .filter(product => {
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price':
                    return a.price - b.price;
                case 'newest':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

    const categories = ['all', ...new Set(state.products.map(product => product.category))];

    return (
        <div className="shop-page">
            {showCartNotification && (
                <div className="cart-notification">
                    <div className="notification-content">
                        <div className="notification-text">
                            <strong>Товар добавлен в корзину!</strong>
                            <p>{addedProductName}</p>
                        </div>
                        <button
                            className="view-cart-btn"
                            onClick={handleViewCart}
                        >
                            Перейти в корзину
                        </button>
                        <button
                            className="notification-close"
                            onClick={() => setShowCartNotification(false)}
                        >
                        </button>
                    </div>
                </div>
            )}

            <div className="shop-container">
                {state.isLoading ? (
                    <div className="loading-section">
                        <div className="loading-spinner"></div>
                        <p>Загрузка товаров...</p>
                    </div>
                ) : state.error ? (
                    <div className="error-section">
                        <h3>Произошла ошибка</h3>
                        <p>{state.error}</p>
                    </div>
                ) : (
                    <>
                        {/* Панель управления */}
                        <div className="shop-controls">
                            <div className="search-wrapper">
                                <input
                                    type="search"
                                    className="search-input"
                                    placeholder="Поиск по названию..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Поиск товаров"
                                />
                                {/* Крестик очистки появляется только при наличии текста */}
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="search-clear-btn"
                                        onClick={() => setSearchQuery('')}
                                        aria-label="Очистить поиск"
                                    />
                                )}
                            </div>

                            {/* Кнопка открытия/закрытия фильтров */}
                            <button
                                type="button"
                                className="filters-toggle-btn"
                                onClick={toggleFilters}
                                aria-expanded={isFiltersOpen}
                                aria-controls="filters-panel"
                            >
                                <span className="icon-filters"></span>
                                Фильтры
                            </button>
                        </div>

                        {/* Панель фильтров (открывается/закрывается) */}
                        <div
                            id="filters-panel"
                            className={`filters-panel ${isFiltersOpen ? 'filters-panel--open' : ''}`}
                        >
                            <div className="filters-content">
                                <div className="filter-group">
                                    <label htmlFor="category">Категория:</label>
                                    <select
                                        id="category"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">Все категории</option>
                                        {categories.filter(cat => cat !== 'all').map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label htmlFor="sort">Сортировка:</label>
                                    <select
                                        id="sort"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="filter-select"
                                    >
                                        <option value="newest">Сначала новые</option>
                                        <option value="name">По названию</option>
                                        <option value="price">По цене (возрастание)</option>
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    className="filters-reset-btn"
                                    onClick={clearFilters}
                                >
                                    <span className="icon-reset"></span>
                                    Сбросить фильтры
                                </button>
                            </div>
                        </div>

                        {filteredAndSortedProducts.length === 0 ? (
                            <div className="no-products">
                                <h3>Товары не найдены</h3>
                                <p>Попробуйте изменить параметры фильтрации</p>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {filteredAndSortedProducts.map(product => (
                                    <div key={product.id} className="product-card">
                                        <div className="product-image">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                loading="lazy"
                                            />
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <div className="discount-badge">
                                                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                                </div>
                                            )}
                                            <button
                                                className="quick-view-btn"
                                                onClick={() => handleQuickView(product)}
                                            >
                                                Быстрый просмотр
                                            </button>
                                        </div>

                                        <div className="product-content">
                                            <div className="product-header">
                                                <h3 className="product-name">{product.name}</h3>
                                                <div className="product-prices">
                                                    <span className="product-price">₽{product.price.toLocaleString()}</span>
                                                    {product.originalPrice && product.originalPrice > product.price && (
                                                        <span className="product-original-price">
                                                            ₽{product.originalPrice.toLocaleString()}
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

                                            <div className="product-actions">
                                                <button
                                                    className="add-to-cart-btn"
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={!product.inStock}
                                                >
                                                    В корзину
                                                </button>
                                                <button
                                                    className="buy-now-btn"
                                                    onClick={() => handleBuyNow(product)}
                                                    disabled={!product.inStock}
                                                >
                                                    Купить
                                                </button>
                                                {/* ★ Кнопка избранного без текста – иконка через CSS */}
                                                <button
                                                    className={`wishlist-btn ${favorites.has(String(product.id)) ? 'active' : ''}`}
                                                    onClick={() => toggleFavorite(String(product.id))}
                                                    aria-label={favorites.has(String(product.id)) ? 'Удалить из избранного' : 'Добавить в избранное'}
                                                >
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                <div className="shop-cta">
                    <h2>Не нашли нужный товар?</h2>
                    <p>Свяжитесь с нами - мы поможем подобрать оптимальное решение</p>
                    <button className="cta-button" onClick={() => alert('Форма связи будет открыта')}>
                        Связаться с консультантом
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuestShop;