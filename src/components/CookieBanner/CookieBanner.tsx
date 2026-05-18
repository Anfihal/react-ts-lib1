import React, { useState, useEffect } from 'react';
import './CookieBanner.css';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

const CookieBanner: React.FC = () => {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="cookie-banner" role="alert" aria-live="polite">
            <div className="cookie-banner__content">
                <div className="cookie-banner__text">
                    <strong>Мы используем cookie</strong>
                    <p>
                        Продолжая использовать сайт, вы соглашаетесь с обработкой файлов cookie в соответствии с нашей{' '}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer">Политикой конфиденциальности</a>.
                    </p>
                </div>
                <button className="cookie-banner__button" onClick={handleAccept}>
                    Согласен
                </button>
            </div>
        </div>
    );
};

export default CookieBanner;