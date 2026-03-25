// src/components/admin/contact/ContactManagement.tsx

import React, { useState, useEffect } from 'react';
import { useContact } from '../../../context/ContactContext';
import './ContactManagement.css';

const ContactManagement: React.FC = () => {
    const { state, updateContactInfo, resetContactInfo, deleteContactInfo } = useContact();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        address: '',
        phone: '',
        email: '',
        workingHours: '',
        telegram: '',
        whatsapp: '',
        vk: '',
        instagram: '',
        mapEmbedUrl: ''
    });

    useEffect(() => {
        if (state.contactInfo) {
            setFormData({
                companyName: state.contactInfo.companyName,
                address: state.contactInfo.address,
                phone: state.contactInfo.phone,
                email: state.contactInfo.email,
                workingHours: state.contactInfo.workingHours,
                telegram: state.contactInfo.socialLinks.telegram || '',
                whatsapp: state.contactInfo.socialLinks.whatsapp || '',
                vk: state.contactInfo.socialLinks.vk || '',
                instagram: state.contactInfo.socialLinks.instagram || '',
                mapEmbedUrl: state.contactInfo.mapEmbedUrl || ''
            });
        }
    }, [state.contactInfo]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const contactData = {
            companyName: formData.companyName,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            workingHours: formData.workingHours,
            socialLinks: {
                telegram: formData.telegram || undefined,
                whatsapp: formData.whatsapp || undefined,
                vk: formData.vk || undefined,
                instagram: formData.instagram || undefined
            },
            mapEmbedUrl: formData.mapEmbedUrl || undefined
        };

        await updateContactInfo(contactData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (state.contactInfo) {
            setFormData({
                companyName: state.contactInfo.companyName,
                address: state.contactInfo.address,
                phone: state.contactInfo.phone,
                email: state.contactInfo.email,
                workingHours: state.contactInfo.workingHours,
                telegram: state.contactInfo.socialLinks.telegram || '',
                whatsapp: state.contactInfo.socialLinks.whatsapp || '',
                vk: state.contactInfo.socialLinks.vk || '',
                instagram: state.contactInfo.socialLinks.instagram || '',
                mapEmbedUrl: state.contactInfo.mapEmbedUrl || ''
            });
        }
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm('Вы действительно хотите удалить всю контактную информацию?')) {
            await deleteContactInfo();
        }
    };

    const handleReset = () => {
        if (window.confirm('Вы действительно хотите сбросить контактную информацию к значениям по умолчанию?')) {
            resetContactInfo();
        }
    };

    if (!state.contactInfo) {
        return <div className="contact-management-loading">Загрузка контактной информации...</div>;
    }

    return (
        <div className="contact-management">
            <div className="contact-header">
                <h2>Управление контактной информацией</h2>
                <p>Редактируйте контактные данные компании. Изменения будут видны всем пользователям на сайте.</p>
            </div>

            <div className="contact-content">
                {!isEditing ? (
                    <div className="contact-preview">
                        <div className="preview-header">
                            <h3>Текущие контакты</h3>
                            <div className="preview-actions">
                                <button
                                    className="btn btn--primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Редактировать контакты
                                </button>
                                <button
                                    className="btn btn--secondary"
                                    onClick={handleReset}
                                >
                                    Сбросить к умолчанию
                                </button>
                                <button
                                    className="btn btn--danger"
                                    onClick={handleDelete}
                                >
                                    Удалить все
                                </button>
                            </div>
                        </div>

                        <div className="contact-info-grid">
                            <div className="info-item">
                                <label>Название компании:</label>
                                <span>{state.contactInfo.companyName}</span>
                            </div>
                            <div className="info-item">
                                <label>Адрес:</label>
                                <span>{state.contactInfo.address}</span>
                            </div>
                            <div className="info-item">
                                <label>Телефон:</label>
                                <span>{state.contactInfo.phone}</span>
                            </div>
                            <div className="info-item">
                                <label>Email:</label>
                                <span>{state.contactInfo.email}</span>
                            </div>
                            <div className="info-item">
                                <label>Режим работы:</label>
                                <span>{state.contactInfo.workingHours}</span>
                            </div>
                            <div className="info-item">
                                <label>Социальные сети:</label>
                                <div className="social-links">
                                    {state.contactInfo.socialLinks.telegram && (
                                        <span className="social-link">Telegram: {state.contactInfo.socialLinks.telegram}</span>
                                    )}
                                    {state.contactInfo.socialLinks.whatsapp && (
                                        <span className="social-link">WhatsApp: {state.contactInfo.socialLinks.whatsapp}</span>
                                    )}
                                    {state.contactInfo.socialLinks.vk && (
                                        <span className="social-link">VK: {state.contactInfo.socialLinks.vk}</span>
                                    )}
                                    {state.contactInfo.socialLinks.instagram && (
                                        <span className="social-link">Instagram: {state.contactInfo.socialLinks.instagram}</span>
                                    )}
                                    {!state.contactInfo.socialLinks.telegram &&
                                        !state.contactInfo.socialLinks.whatsapp &&
                                        !state.contactInfo.socialLinks.vk &&
                                        !state.contactInfo.socialLinks.instagram && (
                                            <span className="no-social">Социальные сети не настроены</span>
                                        )}
                                </div>
                            </div>
                            <div className="info-item">
                                <label>Карта:</label>
                                <span className={state.contactInfo.mapEmbedUrl ? 'map-configured' : 'map-not-configured'}>
                                    {state.contactInfo.mapEmbedUrl ? 'Настроена' : 'Не настроена'}
                                </span>
                            </div>
                        </div>

                        <div className="last-updated">
                            Последнее обновление: {state.contactInfo.lastUpdated.toLocaleString('ru-RU')}
                        </div>
                    </div>
                ) : (
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-header">
                            <h3>Редактирование контактов</h3>
                            <div className="form-actions">
                                <button type="submit" className="btn btn--primary" disabled={state.isSaving}>
                                    {state.isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                                </button>
                                <button type="button" className="btn btn--secondary" onClick={handleCancel}>
                                    Отменить
                                </button>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="companyName">Название компании *</label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Введите название компании"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Адрес *</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Введите полный адрес"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Телефон *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="+7 (999) 123-45-67"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="info@company.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="workingHours">Режим работы *</label>
                                <input
                                    type="text"
                                    id="workingHours"
                                    name="workingHours"
                                    value={formData.workingHours}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Пн-Пт: 9:00-18:00, Сб-Вс: выходной"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="telegram">Telegram</label>
                                <input
                                    type="url"
                                    id="telegram"
                                    name="telegram"
                                    value={formData.telegram}
                                    onChange={handleInputChange}
                                    placeholder="https://t.me/InfiniteleadersTech"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="whatsapp">WhatsApp</label>
                                <input
                                    type="url"
                                    id="whatsapp"
                                    name="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleInputChange}
                                    placeholder="https://wa.me/79991234567"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="vk">VK</label>
                                <input
                                    type="url"
                                    id="vk"
                                    name="vk"
                                    value={formData.vk}
                                    onChange={handleInputChange}
                                    placeholder="https://vk.com/infiniteleaderstech"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="instagram">Instagram</label>
                                <input
                                    type="url"
                                    id="instagram"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleInputChange}
                                    placeholder="https://www.instagram.com/infiniteleaderstech"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="mapEmbedUrl">Ссылка на карту (embed)</label>
                                <textarea
                                    id="mapEmbedUrl"
                                    name="mapEmbedUrl"
                                    value={formData.mapEmbedUrl}
                                    onChange={handleInputChange}
                                    placeholder="Вставьте embed код карты Google Maps или Yandex Maps"
                                    rows={4}
                                />
                                <small className="help-text">
                                    Получить embed код можно в Google Maps: Поделиться → Встроить карту
                                </small>
                            </div>
                        </div>

                        {state.error && (
                            <div className="error-message">
                                {state.error}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactManagement;