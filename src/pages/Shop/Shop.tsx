// src/pages/Shop/Shop.tsx
import React, { useState } from 'react';
import { useProduct } from '../../context/ProductContext';
import './Shop.css';

const Shop: React.FC = () => {
    const { state } = useProduct();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('newest');

    const handleAddToCart = (productName: string) => {
        alert(`Товар "${productName}" добавлен в корзину!`);
    };

    const handleQuickView = (product: any) => {
        alert(`Быстрый просмотр: ${product.name}\nЦена: ₽${product.price.toLocaleString()}\n${product.description}`);
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

                                            <div className="product-features">
                                                {product.features.slice(0, 2).map((feature, index) => (
                                                    <span key={index} className="feature">✓ {feature}</span>
                                                ))}
                                                {product.features.length > 2 && (
                                                    <span className="feature-more">+{product.features.length - 2} ещё</span>
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
                                                className="add-to-cart-btn"
                                                onClick={() => handleAddToCart(product.name)}
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

export default Shop;