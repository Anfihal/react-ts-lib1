// src/pages/Guest/GuestShop/GuestShop.tsx
import React, { useState } from 'react';
import { useProduct } from '../../../context/ProductContext';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './GuestShop.css';

const GuestShop: React.FC = () => {
    const { state } = useProduct();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('newest');
    const [showCartNotification, setShowCartNotification] = useState<boolean>(false);
    const [addedProductName, setAddedProductName] = useState<string>('');

    const handleAddToCart = (product: any) => {
        try {
            // Добавляем товар в корзину
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

            // Показываем уведомление
            setAddedProductName(product.name);
            setShowCartNotification(true);

            // Автоматически скрываем уведомление через 3 секунды
            setTimeout(() => {
                setShowCartNotification(false);
            }, 3000);

        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            alert('Произошла ошибка при добавлении товара в корзину');
        }
    };

    const handleQuickView = (product: any) => {
        alert(`Быстрый просмотр: ${product.name}\nЦена: ₽${product.price.toLocaleString()}\n${product.description}`);
    };

    const handleViewCart = () => {
        // Переходим на страницу корзины
        navigate('/guest/cart');
        setShowCartNotification(false);
    };

    // Фильтрация и сортировка товаров
    const filteredAndSortedProducts = state.products
        .filter(product => product.isActive && product.inStock)
        .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
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

    // Получаем уникальные категории
    const categories = ['all', ...new Set(state.products.map(product => product.category))];

    return (
        <div className="shop-page">
            {/* Уведомление о добавлении в корзину */}
            {showCartNotification && (
                <div className="cart-notification">
                    <div className="notification-content">
                        <span className="notification-icon">✅</span>
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
                            ✕
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
                        {/* Фильтры и сортировка */}
                        <div className="shop-controls">
                            <div className="filters">
                                <label htmlFor="category">Категория:</label>
                                <select
                                    id="category"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="all">Все категории</option>
                                    {categories.filter(cat => cat !== 'all').map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="sorting">
                                <label htmlFor="sort">Сортировка:</label>
                                <select
                                    id="sort"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                >
                                    <option value="newest">Сначала новые</option>
                                    <option value="name">По названию</option>
                                    <option value="price">По цене</option>
                                </select>
                            </div>
                        </div>

                        {/* Сетка товаров */}
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
                                                👁️ Быстрый просмотр
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
                                                    {product.stockQuantity > 5 ? '✅ В наличии' :
                                                        product.stockQuantity > 0 ? `⚠️ Осталось ${product.stockQuantity} шт.` :
                                                            '❌ Нет в наличии'}
                                                </span>
                                            </div>

                                            <div className="product-actions">
                                                <button
                                                    className="add-to-cart-btn"
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={!product.inStock}
                                                >
                                                    {product.inStock ? '🛒 В корзину' : '❌ Нет в наличии'}
                                                </button>
                                                <button
                                                    className="wishlist-btn"
                                                    onClick={() => alert(`Товар "${product.name}" добавлен в избранное`)}
                                                >
                                                    ❤️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* CTA секция */}
                <div className="shop-cta">
                    <h2>Не нашли нужный товар?</h2>
                    <p>Свяжитесь с нами - мы поможем подобрать оптимальное решение</p>
                    <button className="cta-button" onClick={() => alert('Форма связи будет открыта')}>
                        📞 Связаться с консультантом
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuestShop;