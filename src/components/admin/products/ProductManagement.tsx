// src/components/admin/products/ProductManagement.tsx
// src/components/admin/products/ProductManagement.tsx
import React, { useState, useEffect } from 'react';
import { useProduct } from '../../../context/ProductContext';
import type { Product, ProductCreateRequest, ProductUpdateRequest } from '../../../types/ProductTypes';
import './ProductManagement.css';

const ProductManagement: React.FC = () => {
    const { state, addProduct, updateProduct, deleteProduct, setEditingProduct } = useProduct();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        imageUrl: '',
        stockQuantity: '',
        tags: '',
        features: '',
        specifications: ''
    });

    useEffect(() => {
        if (!state.editingProduct && !isAdding) {
            setFormData({
                name: '',
                description: '',
                price: '',
                originalPrice: '',
                category: '',
                imageUrl: '',
                stockQuantity: '',
                tags: '',
                features: '',
                specifications: ''
            });
        }
    }, [state.editingProduct, isAdding]);

    useEffect(() => {
        if (state.editingProduct) {
            setFormData({
                name: state.editingProduct.name,
                description: state.editingProduct.description,
                price: state.editingProduct.price.toString(),
                originalPrice: state.editingProduct.originalPrice?.toString() || '',
                category: state.editingProduct.category,
                imageUrl: state.editingProduct.imageUrl,
                stockQuantity: state.editingProduct.stockQuantity.toString(),
                tags: state.editingProduct.tags.join(', '),
                features: state.editingProduct.features.join('\n'),
                specifications: Object.entries(state.editingProduct.specifications)
                    .map(([key, value]) => `${key}: ${value}`).join('\n')
            });
        }
    }, [state.editingProduct]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                imageUrl
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Парсим массивы и объекты из текстовых полей
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        const features = formData.features.split('\n').filter(feature => feature.trim());
        const specifications = formData.specifications.split('\n').reduce((acc, line) => {
            const [key, ...values] = line.split(':');
            if (key && values.length > 0) {
                acc[key.trim()] = values.join(':').trim();
            }
            return acc;
        }, {} as Record<string, string>);

        if (state.editingProduct) {
            const updateData: ProductUpdateRequest = {
                id: state.editingProduct.id,
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                category: formData.category,
                imageUrl: formData.imageUrl,
                stockQuantity: Number(formData.stockQuantity),
                inStock: Number(formData.stockQuantity) > 0,
                tags,
                features,
                specifications,
                isActive: true
            };
            await updateProduct(updateData);
        } else {
            const createData: ProductCreateRequest = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                category: formData.category,
                imageUrl: formData.imageUrl,
                stockQuantity: Number(formData.stockQuantity),
                tags,
                features,
                specifications
            };
            await addProduct(createData);
            setIsAdding(false);
        }
    };

    const handleCancel = () => {
        setEditingProduct(null);
        setIsAdding(false);
        setFormData({
            name: '',
            description: '',
            price: '',
            originalPrice: '',
            category: '',
            imageUrl: '',
            stockQuantity: '',
            tags: '',
            features: '',
            specifications: ''
        });
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsAdding(false);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
            await deleteProduct(id);
        }
    };

    const categories = ['Ноутбуки', 'Смартфоны', 'Планшеты', 'Аксессуары', 'Компьютеры', 'Мониторы', 'Комплектующие'];

    return (
        <div className="product-management">
            <div className="product-header">
                <h2>Управление товарами</h2>
                <button
                    className="add-product-btn"
                    onClick={() => setIsAdding(true)}
                    disabled={state.isLoading || !!state.editingProduct}
                >
                    Добавить товар
                </button>
            </div>

            {state.error && (
                <div className="error-message">
                    {state.error}
                </div>
            )}

            {/* Форма добавления/редактирования */}
            {(isAdding || state.editingProduct) && (
                <form className="product-form" onSubmit={handleSubmit}>
                    <h3>{state.editingProduct ? 'Редактирование товара' : 'Добавление нового товара'}</h3>

                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Название товара *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                disabled={state.isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Категория *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                disabled={state.isLoading}
                            >
                                <option value="">Выберите категорию</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="description">Описание *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            disabled={state.isLoading}
                            rows={3}
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="price">Цена (₽) *</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                min="0"
                                disabled={state.isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="originalPrice">Старая цена (₽)</label>
                            <input
                                type="number"
                                id="originalPrice"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleInputChange}
                                min="0"
                                disabled={state.isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="stockQuantity">Количество на складе *</label>
                            <input
                                type="number"
                                id="stockQuantity"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleInputChange}
                                required
                                min="0"
                                disabled={state.isLoading}
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="image">Изображение товара *</label>
                        <div className="image-upload-section">
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={state.isLoading}
                                className="image-input"
                            />
                            {formData.imageUrl && (
                                <div className="image-preview">
                                    <img src={formData.imageUrl} alt="Preview" />
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="tags">Теги (через запятую)</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="apple, флагман, новый"
                            disabled={state.isLoading}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="features">Особенности (каждая с новой строки)</label>
                        <textarea
                            id="features"
                            name="features"
                            value={formData.features}
                            onChange={handleInputChange}
                            placeholder="Дисплей 16 дюймов&#10;Процессор M1 Pro&#10;16 ГБ оперативной памяти"
                            disabled={state.isLoading}
                            rows={4}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="specifications">Характеристики (формат: ключ: значение, каждая с новой строки)</label>
                        <textarea
                            id="specifications"
                            name="specifications"
                            value={formData.specifications}
                            onChange={handleInputChange}
                            placeholder="Процессор: Apple M1 Pro&#10;Память: 16 ГБ&#10;Накопитель: 1 ТБ SSD"
                            disabled={state.isLoading}
                            rows={4}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={state.isLoading}
                        >
                            {state.isLoading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleCancel}
                            disabled={state.isLoading}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            )}

            {/* Список товаров */}
            <div className="products-list-section">
                <h3>Список товаров ({state.products.length})</h3>
                {state.products.length === 0 ? (
                    <p className="no-products">Товары не найдены</p>
                ) : (
                    <div className="products-grid">
                        {state.products.map(product => (
                            <div
                                key={product.id}
                                className={`product-card ${product === state.editingProduct ? 'editing' : ''}`}
                            >
                                <div className="product-image">
                                    <img src={product.imageUrl} alt={product.name} />
                                    {!product.inStock && (
                                        <div className="out-of-stock-badge">Нет в наличии</div>
                                    )}
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <div className="discount-badge">
                                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                        </div>
                                    )}
                                </div>
                                <div className="product-content">
                                    <div className="product-header">
                                        <h4 className="product-name">{product.name}</h4>
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
                                        <span className={`product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                            {product.inStock ? `${product.stockQuantity} шт.` : 'Нет в наличии'}
                                        </span>
                                    </div>
                                    <div className="product-tags">
                                        {product.tags.map(tag => (
                                            <span key={tag} className="product-tag">#{tag}</span>
                                        ))}
                                    </div>
                                    <div className="product-dates">
                                        <span>Обновлено: {product.updatedAt.toLocaleDateString('ru-RU')}</span>
                                    </div>
                                </div>
                                <div className="product-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(product)}
                                        disabled={state.isLoading}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(product.id)}
                                        disabled={state.isLoading}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;