import React from 'react';
import { useContact } from '../../context/ContactContext';
import './Contact.css';

const Contact: React.FC = () => {
    const { state } = useContact();

    if (!state.contactInfo) {
        return (
            <div className="contact-page">
                <div className="contact-container">
                    <div className="loading">Загрузка контактной информации...</div>
                </div>
            </div>
        );
    }

    const { contactInfo } = state;

    return (
        <div className="contact-page">
            <div className="contact-container">
                <div className="contact-content">
                    <div className="contact-info-section">
                        <h2>Контактная информация</h2>

                        <div className="contact-details">
                            <div className="contact-item address">
                                <div className="contact-text">
                                    <h3>Адрес</h3>
                                    <p>{contactInfo.address}</p>
                                </div>
                            </div>

                            <div className="contact-item phone">
                                <div className="contact-text">
                                    <h3>Телефон</h3>
                                    <p>
                                        <a href={`tel:${contactInfo.phone}`} className="contact-link">
                                            {contactInfo.phone}
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="contact-item email">
                                <div className="contact-text">
                                    <h3>Email</h3>
                                    <p>
                                        <a href={`mailto:${contactInfo.email}`} className="contact-link">
                                            {contactInfo.email}
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="contact-item hours">
                                <div className="contact-text">
                                    <h3>Режим работы</h3>
                                    <p>{contactInfo.workingHours}</p>
                                </div>
                            </div>
                        </div>

                        {/* Социальные сети */}
                        {(contactInfo.socialLinks.telegram || contactInfo.socialLinks.whatsapp || contactInfo.socialLinks.vk || contactInfo.socialLinks.instagram) && (
                            <div className="social-section">
                                <h3>Мы в социальных сетях</h3>
                                <div className="social-buttons">
                                    {contactInfo.socialLinks.telegram && (
                                        <a
                                            href={contactInfo.socialLinks.telegram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-btn telegram"
                                        >
                                            Telegram
                                        </a>
                                    )}
                                    {contactInfo.socialLinks.whatsapp && (
                                        <a
                                            href={contactInfo.socialLinks.whatsapp}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-btn whatsapp"
                                        >
                                            WhatsApp
                                        </a>
                                    )}
                                    {contactInfo.socialLinks.vk && (
                                        <a
                                            href={contactInfo.socialLinks.vk}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-btn vk"
                                        >
                                            VK
                                        </a>
                                    )}
                                    {contactInfo.socialLinks.instagram && (
                                        <a
                                            href={contactInfo.socialLinks.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-btn instagram"
                                        >
                                            Instagram
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Карта */}
                    {contactInfo.mapEmbedUrl && (
                        <div className="map-section">
                            <h2>На карте</h2>
                            <div className="map-container">
                                <iframe
                                    src={contactInfo.mapEmbedUrl}
                                    width="100%"
                                    height="400"
                                    style={{ border: 0, borderRadius: '16px' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Карта расположения компании"
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;