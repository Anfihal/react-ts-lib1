// src/pages/guest/Cart/Cart.tsx
import React from 'react';
import CartComponent from '../../../components/guest/Cart/Cart';

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