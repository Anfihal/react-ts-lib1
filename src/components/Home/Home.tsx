// src/pages/Home/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHome } from '../../context/HomeContext';
import './Home.css';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useHome();

    const handleStartProject = () => {
        navigate('/login');
    };

    const handleLearnMore = () => {
        navigate('/about');
    };

    if (!state.homeContent) {
        return (
            <div className="home-page">
                <div className="loading">Загрузка...</div>
            </div>
        );
    }

    const content = state.homeContent;

    return (
        <div className="home-page">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="home-video-background"
                poster={content.videoPoster}
            >
                <source src={content.videoUrl} type="video/mp4" />
                Ваш браузер не поддерживает видео.
            </video>

            <div className="container">
                <section className="hero-section">
                    <div className="hero-content">
                        <h1>{content.heroTitle}</h1>
                        <p>{content.heroSubtitle}</p>
                        <div className="hero-actions">
                            <button className="btn-primary" onClick={handleStartProject}>
                                {content.primaryButtonText}
                                <span className="btn-icon">{content.primaryButtonIcon}</span>
                            </button>
                            <button className="btn-secondary" onClick={handleLearnMore}>
                                {content.secondaryButtonText}
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