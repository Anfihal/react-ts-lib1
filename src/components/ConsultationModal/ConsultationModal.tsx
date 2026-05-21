import React, { useState } from "react";
import "./ConsultationModal.css";

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceName: string;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({
    isOpen,
    onClose,
    serviceName,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: "",
        preferredContact: "phone",
        socialLinks: {
            telegram: "",
            whatsapp: "",
            vk: "",
            instagram: "",
        },
    });

    if (!isOpen) {
        return null;
    }

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name.startsWith("social.")) {
            const socialName = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [socialName]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const hasPhone = formData.phone.trim().length > 0;
        const hasSocial = Object.values(formData.socialLinks).some(
            (value) => value.trim().length > 0
        );

        if (!hasPhone && !hasSocial) {
            alert("Пожалуйста, укажите телефон или хотя бы одну социальную сеть");
            return;
        }

        console.log("Заявка отправлена:", {
            ...formData,
            service: serviceName,
        });

        alert(`Заявка на консультацию по услуге "${serviceName}" отправлена!`);

        onClose();
        setFormData({
            name: "",
            phone: "",
            email: "",
            message: "",
            preferredContact: "phone",
            socialLinks: {
                telegram: "",
                whatsapp: "",
                vk: "",
                instagram: "",
            },
        });
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Запись на консультацию</h2>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Закрыть"
                    />
                </div>

                <div className="modal-service-info">
                    <p>
                        Выбранная услуга: <strong>{serviceName}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="consultation-form">
                    <div className="form-group">
                        <label htmlFor="name">Имя *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            placeholder="Введите ваше имя"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Телефон</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormChange}
                            placeholder="+7 (___) ___-__-__"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            placeholder="example@mail.com"
                        />
                    </div>

                    {/* Секция социальных сетей */}
                    <div className="social-section">
                        <h4>Социальные сети</h4>
                        <div className="social-grid">
                            <div className="social-input-group social-telegram">
                                <label htmlFor="telegram">Telegram</label>
                                <input
                                    type="text"
                                    id="telegram"
                                    name="social.telegram"
                                    value={formData.socialLinks.telegram}
                                    onChange={handleFormChange}
                                    placeholder="@username"
                                />
                            </div>

                            <div className="social-input-group social-whatsapp">
                                <label htmlFor="whatsapp">WhatsApp</label>
                                <input
                                    type="text"
                                    id="whatsapp"
                                    name="social.whatsapp"
                                    value={formData.socialLinks.whatsapp}
                                    onChange={handleFormChange}
                                    placeholder="Номер телефона"
                                />
                            </div>

                            <div className="social-input-group social-vk">
                                <label htmlFor="vk">VK</label>
                                <input
                                    type="text"
                                    id="vk"
                                    name="social.vk"
                                    value={formData.socialLinks.vk}
                                    onChange={handleFormChange}
                                    placeholder="id123456"
                                />
                            </div>

                            <div className="social-input-group social-instagram">
                                <label htmlFor="instagram">Instagram</label>
                                <input
                                    type="text"
                                    id="instagram"
                                    name="social.instagram"
                                    value={formData.socialLinks.instagram}
                                    onChange={handleFormChange}
                                    placeholder="@username"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Комментарий</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleFormChange}
                            placeholder="Опишите ваш вопрос или задачу"
                            rows={4}
                        />
                    </div>

                    <div className="form-notice">
                        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                    </div>

                    <button type="submit" className="submit-btn">
                        Отправить заявку
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConsultationModal;