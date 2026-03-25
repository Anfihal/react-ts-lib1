// src/hooks/useAddToCart.ts
import { useCart } from '../context/CartContext';
import type { CartItem } from '../context/CartContext';

export const useAddToCart = () => {
    const { dispatch } = useCart();

    const addToCart = (item: Omit<CartItem, 'quantity'>) => {
        dispatch({
            type: 'ADD_ITEM',
            payload: { ...item, quantity: 1 }
        });
    };

    return addToCart;
};