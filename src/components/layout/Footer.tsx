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
                            <p>📧 info@itsolutions.com</p>
                            <p>📞 +7 (999) 123-45-67</p>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} ILT. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;