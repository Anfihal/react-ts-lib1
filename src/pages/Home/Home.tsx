import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleStartProject = () => {
        navigate('src/components/auth/Login.tsx');
    };

    const handleLearnMore = () => {
        navigate('/about');
    };

    return (
        <div className="home-page">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="home-video-background"
                poster="/images/video-poster.jpg"
            >
                <source src="/videos/hero-background.mp4" type="video/mp4" />
                Ваш браузер не поддерживает видео.
            </video>

            <div className="container">
                <section className="hero-section">
                    <div className="hero-content">
                        <h1>Профессиональные IT-решения для вашего бизнеса</h1>
                        <p>Разработка, дизайн и консалтинг от опытной команды специалистов</p>
                        <div className="hero-actions">
                            <button className="btn-primary" onClick={handleStartProject}>
                                Начать проект
                                <span className="btn-icon">🚀</span>
                            </button>
                            <button className="btn-secondary" onClick={handleLearnMore}>
                                Узнать больше
                                <span className="btn-arrow"></span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;