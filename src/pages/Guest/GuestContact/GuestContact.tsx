// src/pages/Guest/GuestContact/GuestContact.tsx
import React from 'react';
import { useContact } from '../../../context/ContactContext';
import './GuestContact.css';

const GuestContact: React.FC = () => {
    const { state } = useContact();
    const { contactInfo } = state;

    if (!contactInfo) {
        return (
            <div className="guest-contact-page">
                <div className="container">
                    <h1>Контакты</h1>
                    <p>Загрузка контактной информации...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="guest-contact-page">
            <div className="container">
                <div className="guest-contact-content">
                    {/* Основная контактная информация */}
                    <div className="contact-info-section">
                        <h2>Контактная информация</h2>
                        <div className="contact-info-grid">
                            <div className="contact-item">
                                <div className="contact-details">
                                    <strong>Компания</strong>
                                    <span>{contactInfo.companyName}</span>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-details">
                                    <strong>Адрес</strong>
                                    <span>{contactInfo.address}</span>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-details">
                                    <strong>Телефон</strong>
                                    <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-details">
                                    <strong>Email</strong>
                                    <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-details">
                                    <strong>Часы работы</strong>
                                    <span>{contactInfo.workingHours}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Социальные сети */}
                    <div className="social-section">
                        <h2>Мы в социальных сетях</h2>
                        <div className="social-links">
                            {contactInfo.socialLinks.telegram && (
                                <a
                                    href={contactInfo.socialLinks.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link telegram"
                                    aria-label="Telegram"
                                >
                                    {/* SVG иконка будет через CSS */}
                                </a>
                            )}
                            {contactInfo.socialLinks.whatsapp && (
                                <a
                                    href={contactInfo.socialLinks.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link whatsapp"
                                    aria-label="WhatsApp"
                                >
                                    {/* SVG иконка будет через CSS */}
                                </a>
                            )}
                            {contactInfo.socialLinks.vk && (
                                <a
                                    href={contactInfo.socialLinks.vk}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link vk"
                                    aria-label="ВКонтакте"
                                >
                                    {/* SVG иконка будет через CSS */}
                                </a>
                            )}
                            {contactInfo.socialLinks.instagram && (
                                <a
                                    href={contactInfo.socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link instagram"
                                    aria-label="Instagram"
                                >
                                    {/* SVG иконка будет через CSS */}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Карта */}
                    {contactInfo.mapEmbedUrl && (
                        <div className="map-section">
                            <h2>Как нас найти</h2>
                            <div className="map-container">
                                <iframe
                                    src={contactInfo.mapEmbedUrl}
                                    width="100%"
                                    height="400"
                                    className="map-iframe"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Карта расположения компании"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuestContact;