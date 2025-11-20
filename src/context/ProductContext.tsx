// src/context/ProductContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product, ProductCreateRequest, ProductUpdateRequest } from '../types/ProductTypes';

interface ProductState {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    editingProduct: Product | null;
}

type ProductAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'LOAD_PRODUCTS'; payload: Product[] }
    | { type: 'ADD_PRODUCT'; payload: Product }
    | { type: 'UPDATE_PRODUCT'; payload: Product }
    | { type: 'DELETE_PRODUCT'; payload: number }
    | { type: 'SET_EDITING_PRODUCT'; payload: Product | null };

interface ProductContextType {
    state: ProductState;
    addProduct: (data: ProductCreateRequest) => Promise<void>;
    updateProduct: (data: ProductUpdateRequest) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    setEditingProduct: (product: Product | null) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'LOAD_PRODUCTS':
            return { ...state, products: action.payload, error: null };
        case 'ADD_PRODUCT':
            return { ...state, products: [...state.products, action.payload], error: null };
        case 'UPDATE_PRODUCT':
            return {
                ...state,
                products: state.products.map(p => p.id === action.payload.id ? action.payload : p),
                error: null
            };
        case 'DELETE_PRODUCT':
            return {
                ...state,
                products: state.products.filter(p => p.id !== action.payload),
                error: null
            };
        case 'SET_EDITING_PRODUCT':
            return { ...state, editingProduct: action.payload };
        default:
            return state;
    }
};

const initialProducts: Product[] = [
    {
        id: 1,
        name: 'MacBook Pro 16"',
        description: 'Мощный ноутбук для профессиональной работы',
        price: 249990,
        originalPrice: 279990,
        category: 'Ноутбуки',
        imageUrl: '/images/products/macbook-pro.jpg',
        images: ['/images/products/macbook-pro-1.jpg', '/images/products/macbook-pro-2.jpg'],
        inStock: true,
        stockQuantity: 15,
        tags: ['apple', 'профессиональный', 'm1'],
        features: ['Дисплей 16 дюймов', 'Процессор M1 Pro', '16 ГБ оперативной памяти'],
        specifications: {
            'Процессор': 'Apple M1 Pro',
            'Память': '16 ГБ',
            'Накопитель': '1 ТБ SSD',
            'Экран': '16.2 дюйма, Liquid Retina XDR'
        },
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        id: 2,
        name: 'iPhone 15 Pro',
        description: 'Флагманский смартфон с инновационными возможностями',
        price: 119990,
        originalPrice: 129990,
        category: 'Смартфоны',
        imageUrl: '/images/products/iphone-15-pro.jpg',
        images: ['/images/products/iphone-15-pro-1.jpg', '/images/products/iphone-15-pro-2.jpg'],
        inStock: true,
        stockQuantity: 25,
        tags: ['apple', 'флагман', 'титановый'],
        features: ['Титановый корпус', 'Камера 48 МП', 'Чип A17 Pro'],
        specifications: {
            'Экран': '6.1 дюйма, Super Retina XDR',
            'Процессор': 'Apple A17 Pro',
            'Память': '128 ГБ',
            'Камера': '48 МП + 12 МП + 12 МП'
        },
        isActive: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
    }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(productReducer, {
        products: [],
        isLoading: false,
        error: null,
        editingProduct: null
    });

    const addProduct = async (data: ProductCreateRequest): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newProduct: Product = {
                ...data,
                id: Math.max(0, ...state.products.map(p => p.id)) + 1,
                inStock: data.stockQuantity > 0,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
            console.log('Product added:', newProduct);

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Ошибка при добавлении товара' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const updateProduct = async (data: ProductUpdateRequest): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Находим текущий товар чтобы сохранить createdAt
            const currentProduct = state.products.find(p => p.id === data.id);

            const updatedProduct: Product = {
                ...data,
                createdAt: currentProduct?.createdAt || new Date(),
                updatedAt: new Date()
            };

            dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
            dispatch({ type: 'SET_EDITING_PRODUCT', payload: null });
            console.log('Product updated:', updatedProduct);

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Ошибка при обновлении товара' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const deleteProduct = async (id: number): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            await new Promise(resolve => setTimeout(resolve, 500));

            dispatch({ type: 'DELETE_PRODUCT', payload: id });
            console.log('Product deleted:', id);

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Ошибка при удалении товара' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const setEditingProduct = (product: Product | null) => {
        dispatch({ type: 'SET_EDITING_PRODUCT', payload: product });
    };

    useEffect(() => {
        dispatch({ type: 'LOAD_PRODUCTS', payload: initialProducts });
    }, []);

    const value: ProductContextType = {
        state,
        addProduct,
        updateProduct,
        deleteProduct,
        setEditingProduct
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
};