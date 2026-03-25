import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-logo">ILT</h3>
                        <p className="footer-description">
                            Профессиональные IT-услуги для вашего бизнеса
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4>Услуги</h4>
                        <ul className="footer-links">
                            <li><a href="/services">Веб-разработка</a></li>
                            <li><a href="/services">Мобильные приложения</a></li>
                            <li><a href="/services">UI/UX Дизайн</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Компания</h4>
                        <ul className="footer-links">
                            <li><a href="/about">О нас</a></li>
                            <li><a href="/contact">Контакты</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Контакты</h4>
                        <div className="footer-contact">
                            <p>📧 InfiniteleadersTech@yandex.ru</p>
                        </div>
                    </div>

                    {/* Новый раздел Документы */}
                    <div className="footer-section">
                        <h4>Документы</h4>
                        <ul className="footer-links documents-list">
                            <li><a href="/privacy-policy">Политика конфиденциальности</a></li>
                            <li><a href="/user-agreement">Пользовательское соглашение</a></li>
                            <li><a href="/personal-data-consent">Согласие на обработку ПД</a></li>
                            <li><a href="/cookie-policy">Политика использования cookie</a></li>
                            <li><a href="/legal-info">Реквизиты владельца</a></li>
                            <li><a href="/terms-of-sale">Правила продажи услуг</a></li>
                            <li><a href="/refund-policy">Информация о возвратах</a></li>
                            <li><a href="/license-agreement">Лицензионное соглашение</a></li>
                            <li><a href="/copyright">Уведомления об авторских правах</a></li>
                        </ul>
                    </div>
                </div>

                {/* Блок с реквизитами для наглядности */}
                <div className="footer-company-details">
                    <p><strong>ИП/ООО "Инфинити"</strong> | ИНН: 1234567890 | ОГРН: 1234567890123 | Юридический адрес: г. Москва, ул. Примерная, д. 1</p>
                    <p className="company-details-disclaimer">
                        * Информация о юридическом лице предоставлена для ознакомления. Полные реквизиты доступны в разделе <a href="/legal-info">Реквизиты владельца</a>.
                    </p>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} ILT. Все права защищены. Любое использование материалов сайта без разрешения запрещено.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;