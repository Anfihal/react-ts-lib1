// src/pages/ProductDetail/ProductDetail.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../../context/ProductContext';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { state } = useProduct();

    const product = state.products.find(p => p.id === Number(id));

    if (state.isLoading) {
        return <div className="detail-loading">Загрузка...</div>;
    }

    if (!product) {
        return (
            <div className="detail-not-found">
                <h2>Товар не найден</h2>
                <button onClick={() => navigate('/shop')}>Вернуться в магазин</button>
            </div>
        );
    }

    return (
        <div className="product-detail">
            <div className="detail-container">
                <button className="back-btn" onClick={() => navigate('/shop')}>
                    ← Назад в магазин
                </button>

                <div className="detail-grid">
                    <div className="detail-image">
                        <img src={product.imageUrl} alt={product.name} />
                        {product.originalPrice && product.originalPrice > product.price && (
                            <div className="detail-discount">
                                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                            </div>
                        )}
                    </div>

                    <div className="detail-info">
                        <h1>{product.name}</h1>
                        <div className="detail-prices">
                            <span className="detail-price">₽{product.price.toLocaleString('ru-RU')}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="detail-old-price">₽{product.originalPrice.toLocaleString('ru-RU')}</span>
                            )}
                        </div>

                        <div className="detail-meta">
                            <span className="detail-category">{product.category}</span>
                            <span className={`detail-stock ${product.stockQuantity <= 5 ? 'low-stock' : ''}`}>
                                {product.stockQuantity > 5
                                    ? 'В наличии'
                                    : product.stockQuantity > 0
                                        ? `Осталось ${product.stockQuantity} шт.`
                                        : 'Нет в наличии'}
                            </span>
                        </div>

                        <p className="detail-description">{product.description}</p>

                        {product.features && product.features.length > 0 && (
                            <div className="detail-features">
                                <h3>Характеристики</h3>
                                <ul>
                                    {product.features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {product.tags && product.tags.length > 0 && (
                            <div className="detail-tags">
                                {product.tags.map(tag => (
                                    <span key={tag} className="tag">#{tag}</span>
                                ))}
                            </div>
                        )}

                        <div className="detail-actions">
                            <button
                                className="add-to-cart"
                                onClick={() => alert(`Товар "${product.name}" добавлен в корзину`)}
                                disabled={!product.inStock}
                            >
                                В корзину
                            </button>
                            <button
                                className="buy-now"
                                onClick={() => alert(`Покупка товара "${product.name}"`)}
                                disabled={!product.inStock}
                            >
                                Купить сейчас
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;