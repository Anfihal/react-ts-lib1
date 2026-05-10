// src/components/guest/Cart/Cart.tsx
// src/components/guest/Cart/Cart.tsx
import React from 'react';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import './Cart.css';

const Cart: React.FC = () => {
    const { state, dispatch } = useCart();
    const navigate = useNavigate();

    const handleUpdateQuantity = (id: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    };

    const handleRemoveItem = (id: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
    };

    const handleClearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const handleContinueShopping = () => {
        navigate('/guest/Guestshop');
    };

    const handleCheckout = () => {
        navigate('/guest/checkout');
    };

    if (state.items.length === 0) {
        return (
            <div className="cart-empty">
                {/* Иконка теперь только в CSS */}
                <div className="empty-icon" aria-hidden="true"></div>
                <h3>Корзина пуста</h3>
                <p>Добавьте товары или услуги из магазина</p>
                <button
                    className="continue-shopping-btn"
                    onClick={handleContinueShopping}
                >
                    Вернуться в магазин
                </button>
            </div>
        );
    }

    return (
        <div className="cart">
            <div className="cart-header">
                <h2>Корзина ({state.itemCount})</h2>
                <button className="clear-cart-btn" onClick={handleClearCart}>
                    Очистить корзину
                </button>
            </div>

            <div className="cart-items">
                {state.items.map(item => (
                    <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                    />
                ))}
            </div>

            <div className="cart-summary">
                <div className="cart-total">
                    <strong>Итого: {state.total} ₽</strong>
                    <span>Товаров: {state.itemCount} шт.</span>
                </div>

                <div className="cart-actions">
                    <button
                        className="continue-shopping-btn"
                        onClick={handleContinueShopping}
                    >
                        Продолжить покупки
                    </button>
                    <button
                        className="checkout-btn"
                        onClick={handleCheckout}
                    >
                        Оформить заказ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;