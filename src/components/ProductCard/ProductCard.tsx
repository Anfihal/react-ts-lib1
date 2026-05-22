// src/components/ProductCard/ProductCard.tsx
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/ProductTypes';
import './ProductCard.css';

interface ProductCardProps {
    product: Product;
    onAddToCart: (productName: string) => void;
    onBuyNow: (productName: string) => void;
    onQuickView: (product: Product) => void;
    onAddToWishlist: (productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
    onBuyNow,
    onQuickView,
    onAddToWishlist,
}) => {
    const navigate = useNavigate();

    const handleCardClick = useCallback(() => {
        navigate(`/product/${product.id}`);
    }, [navigate, product.id]);

    const handleAddToCartClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onAddToCart(product.name);
        },
        [onAddToCart, product.name]
    );

    const handleBuyNowClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onBuyNow(product.name);
        },
        [onBuyNow, product.name]
    );

    const handleQuickViewClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onQuickView(product);
        },
        [onQuickView, product]
    );

    const handleWishlistClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onAddToWishlist(product.name);
        },
        [onAddToWishlist, product.name]
    );

    return (
        <article className="product-card" onClick={handleCardClick} role="button" tabIndex={0}>
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
                    onClick={handleQuickViewClick}
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
                        <span key={index} className="feature">
                            {feature}
                        </span>
                    ))}
                    {product.features.length > 2 && (
                        <span className="feature-more">+{product.features.length - 2}</span>
                    )}
                </div>

                <div className="product-tags">
                    {product.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="product-tag">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="product-actions">
                <button
                    type="button"
                    className="add-to-cart-btn"
                    onClick={handleAddToCartClick}
                    disabled={!product.inStock}
                    aria-disabled={!product.inStock}
                >
                    <span className="icon-cart"></span>
                    В корзину
                </button>

                <button
                    type="button"
                    className="buy-now-btn"
                    onClick={handleBuyNowClick}
                    disabled={!product.inStock}
                    aria-disabled={!product.inStock}
                >
                    <span className="icon-buy"></span>
                    Купить
                </button>

                <button
                    type="button"
                    className="wishlist-btn"
                    onClick={handleWishlistClick}
                    aria-label="Добавить в избранное"
                >
                    <span className="icon-wishlist"></span>
                </button>
            </div>
        </article>
    );
};

export default ProductCard;