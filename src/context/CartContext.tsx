// src/context/CartContext.tsx
import React, { createContext, useContext, useReducer, type ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    type: 'product' | 'service';
    image?: string;
    description?: string;
    inStock?: boolean;
    stockQuantity?: number;
    imageUrl?: string;
}

interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' };

interface CartContextType {
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.items.find(item => item.id === action.payload.id);

            if (existingItem) {
                const updatedItems = state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                );
                return {
                    ...state,
                    items: updatedItems,
                    total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                    itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0)
                };
            }

            const newItems = [...state.items, action.payload];
            return {
                ...state,
                items: newItems,
                total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: newItems.reduce((count, item) => count + item.quantity, 0)
            };
        }

        case 'REMOVE_ITEM': {
            const filteredItems = state.items.filter(item => item.id !== action.payload);
            return {
                ...state,
                items: filteredItems,
                total: filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: filteredItems.reduce((count, item) => count + item.quantity, 0)
            };
        }

        case 'UPDATE_QUANTITY': {
            const updatedItems = state.items.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            ).filter(item => item.quantity > 0);

            return {
                ...state,
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0)
            };
        }

        case 'CLEAR_CART':
            return {
                items: [],
                total: 0,
                itemCount: 0
            };

        default:
            return state;
    }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        total: 0,
        itemCount: 0
    });

    // Вспомогательные функции
    const addToCart = (item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const removeFromCart = (id: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
    };

    const updateQuantity = (id: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const value: CartContextType = {
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};