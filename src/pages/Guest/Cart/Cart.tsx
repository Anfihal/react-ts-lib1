// src/pages/guest/Cart/Cart.tsx
import React from 'react';
import CartComponent from '../../../components/guest/Cart/Cart';
import './Cart.css';

const Cart: React.FC = () => {
    return (
        <div className="cart-page">
            <div className="container">
                <CartComponent />
            </div>
        </div>
    );
};

export default Cart;