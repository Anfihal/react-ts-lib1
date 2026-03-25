// src/components/admin/services/ServiceManagement.tsx
// src/components/admin/services/ServiceManagement.tsx
import React, { useState, useEffect } from 'react';
import { useService } from '../../../context/ServiceContext';
import type { Service, ServiceCreateRequest, ServiceUpdateRequest } from '../../../types/ServiceTypes';
import './ServiceManagement.css';

const ServiceManagement: React.FC = () => {
    const { state, addService, updateService, deleteService, setEditingService } = useService();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        duration: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (!state.editingService && !isAdding) {
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                duration: '',
                imageUrl: ''
            });
        }
    }, [state.editingService, isAdding]);

    useEffect(() => {
        if (state.editingService) {
            setFormData({
                name: state.editingService.name,
                description: state.editingService.description,
                price: state.editingService.price.toString(),
                category: state.editingService.category,
                duration: state.editingService.duration || '',
                imageUrl: state.editingService.imageUrl || ''
            });
        }
    }, [state.editingService]);

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

        if (state.editingService) {
            const updateData: ServiceUpdateRequest = {
                id: state.editingService.id,
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                duration: formData.duration || undefined,
                imageUrl: formData.imageUrl || undefined,
                isActive: true
            };
            await updateService(updateData);
        } else {
            const createData: ServiceCreateRequest = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                duration: formData.duration || undefined,
                imageUrl: formData.imageUrl || undefined
            };
            await addService(createData);
            setIsAdding(false);
        }

        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            duration: '',
            imageUrl: ''
        });
    };

    const handleCancel = () => {
        setEditingService(null);
        setIsAdding(false);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            duration: '',
            imageUrl: ''
        });
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setIsAdding(false);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить эту услугу?')) {
            await deleteService(id);
        }
    };

    return (
        <div className="service-management">
            <div className="service-header">
                <h2>Управление услугами</h2>
                <button
                    className="add-service-btn"
                    onClick={() => setIsAdding(true)}
                    disabled={state.isLoading || !!state.editingService}
                >
                    Добавить услугу
                </button>
            </div>

            {state.error && (
                <div className="error-message">
                    {state.error}
                </div>
            )}

            {(isAdding || state.editingService) && (
                <form className="service-form" onSubmit={handleSubmit}>
                    <h3>{state.editingService ? 'Редактирование услуги' : 'Добавление новой услуги'}</h3>

                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Название услуги *</label>
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
                                <option value="Разработка">Разработка</option>
                                <option value="Дизайн">Дизайн</option>
                                <option value="Маркетинг">Маркетинг</option>
                                <option value="Консалтинг">Консалтинг</option>
                                <option value="Поддержка">Поддержка</option>
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
                            <label htmlFor="duration">Срок выполнения</label>
                            <input
                                type="text"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                placeholder="например, 2-4 недели"
                                disabled={state.isLoading}
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="image">Изображение услуги</label>
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
                                    </button>
                                </div>
                            )}
                        </div>
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

            <div className="services-list-section">
                <h3>Список услуг ({state.services.length})</h3>
                {state.services.length === 0 ? (
                    <p className="no-services">Услуги не найдены</p>
                ) : (
                    <div className="services-grid">
                        {state.services.map(service => (
                            <div
                                key={service.id}
                                className={`service-card ${service === state.editingService ? 'editing' : ''}`}
                            >
                                {service.imageUrl && (
                                    <div className="service-image">
                                        <img src={service.imageUrl} alt={service.name} />
                                    </div>
                                )}
                                <div className="service-content">
                                    <h4 className="service-title">{service.name}</h4>
                                    <p className="service-description">{service.description}</p>
                                    <div className="service-meta">
                                        <span className="service-category">{service.category}</span>
                                        <span className="service-price">₽{service.price.toLocaleString()}</span>
                                        {service.duration && (
                                            <span className="service-duration">{service.duration}</span>
                                        )}
                                        <span className={`service-status ${service.isActive ? 'active' : 'inactive'}`}>
                                            {service.isActive ? 'Активна' : 'Неактивна'}
                                        </span>
                                    </div>
                                    <div className="service-dates">
                                        {service.createdAt && (
                                            <span>Создано: {service.createdAt.toLocaleDateString('ru-RU')}</span>
                                        )}
                                        {service.updatedAt && (
                                            <span>Обновлено: {service.updatedAt.toLocaleDateString('ru-RU')}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="service-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(service)}
                                        disabled={state.isLoading}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(service.id)}
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

export default ServiceManagement;