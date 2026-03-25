// src/components/guest/Cart/CartItem.tsx
import React from 'react';
import type { CartItem as CartItemType } from '../../../context/CartContext';
import './Cart.css';

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="cart-item">
            <div className="cart-item-image">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                ) : item.image ? (
                    <img src={item.image} alt={item.name} />
                ) : (
                    <div className="cart-item-placeholder">
                        {item.type === 'product' ? '🛒' : '🛍️'}
                    </div>
                )}
            </div>

            <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p className="cart-item-type">
                    {item.type === 'product' ? 'Товар' : 'Услуга'}
                </p>
                {item.description && (
                    <p className="cart-item-description">{item.description}</p>
                )}
            </div>

            <div className="cart-item-controls">
                <div className="quantity-controls">
                    <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >
                        -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                        +
                    </button>
                </div>

                <div className="cart-item-price">
                    {item.price * item.quantity} ₽
                </div>

                <button
                    className="remove-btn"
                    onClick={() => onRemove(item.id)}
                >
                    🗑️
                </button>
            </div>
        </div>
    );
};

export default CartItem;