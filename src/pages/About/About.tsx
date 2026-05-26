// src/pages/About/About.tsx
import React, { useEffect } from 'react';   // ← добавлен импорт useEffect
import { useAbout } from '../../context/AboutContext';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './About.css';

const About: React.FC = () => {
    const { state } = useAbout();

    // Эффект для движения мыши (радиальный градиент)
    useEffect(() => {
        const aboutPage = document.querySelector<HTMLElement>(".about-page");
        if (!aboutPage) return;
        const handleMouseMove = (e: MouseEvent) => {
            aboutPage.style.setProperty('--mouse-x', `${e.clientX}px`);
            aboutPage.style.setProperty('--mouse-y', `${e.clientY}px`);
        };
        aboutPage.style.setProperty('--mouse-x', '50%');
        aboutPage.style.setProperty('--mouse-y', '50%');
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    if (!state.aboutContent) {
        return (
            <div className="about-page">
                <div className="about-page__loading">Загрузка информации...</div>
            </div>
        );
    }

    const {
        mission,
        vision,
        values,
        stats,
        teamMembers,
        achievements,
        heroWeb,
        heroThreeD,
    } = state.aboutContent;

    // Пути к изображениям персонажей (если не заданы в контексте, используем заглушки)
    const webCharacterImage = heroWeb?.characterImage || '/images/about/web-character.svg';
    const threeDCharacterImage = heroThreeD?.characterImage || '/images/about/3d-character.svg';

    return (
        <div className="about-page">
            {/* Герой секция - два направления (только если данные есть) */}
            {heroWeb && heroThreeD && (
                <section className="about-hero">
                    <div className="about-hero__overlay"></div>
                    <div className="about-container">
                        <div className="about-hero__dual">
                            {/* Блок Веб-разработки */}
                            <div className="hero-dual-item hero-dual-item--web glass-card">
                                <div className="hero-dual-content">
                                    <h2 className="hero-dual-company">{heroWeb.companyName}</h2>
                                    <h1 className="hero-dual-title">{heroWeb.title}</h1>
                                    <p className="hero-dual-subtitle">{heroWeb.subtitle}</p>
                                    <p className="hero-dual-description">{heroWeb.description}</p>
                                </div>
                                <div className="hero-dual-character hero-dual-character--web">
                                    <img src={webCharacterImage} alt="Веб-разработка" />
                                </div>
                            </div>

                            {/* Разделитель */}
                            <div className="hero-dual-divider">
                                <span className="hero-dual-divider-icon">⚡</span>
                            </div>

                            {/* Блок 3D-разработки */}
                            <div className="hero-dual-item hero-dual-item--threeD glass-card">
                                <div className="hero-dual-character hero-dual-character--threeD">
                                    <img src={threeDCharacterImage} alt="3D-разработка" />
                                </div>
                                <div className="hero-dual-content">
                                    <h2 className="hero-dual-company">{heroThreeD.companyName}</h2>
                                    <h1 className="hero-dual-title">{heroThreeD.title}</h1>
                                    <p className="hero-dual-subtitle">{heroThreeD.subtitle}</p>
                                    <p className="hero-dual-description">{heroThreeD.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Статистика */}
            {stats.length > 0 && (
                <section className="about-stats">
                    <div className="about-container">
                        <h2 className="about-section-title">Наша статистика</h2>
                        <div className="about-stats__grid">
                            {stats.map((stat) => (
                                <div key={stat.id} className="about-stat-card glass-card">
                                    <div className="about-stat-card__number">{stat.number}</div>
                                    <div className="about-stat-card__label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Миссия и видение */}
            <section className="about-mission">
                <div className="about-container">
                    <div className="about-mission__grid">
                        <div className="about-mission-card glass-card">
                            <div className="about-mission-card__icon about-mission-card__icon--target"></div>
                            <h3 className="about-mission-card__title">Наша миссия</h3>
                            <p className="about-mission-card__text">{mission}</p>
                        </div>
                        <div className="about-mission-card glass-card">
                            <div className="about-mission-card__icon about-mission-card__icon--vision"></div>
                            <h3 className="about-mission-card__title">Наше видение</h3>
                            <p className="about-mission-card__text">{vision}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ценности */}
            {values.length > 0 && (
                <section className="about-values">
                    <div className="about-container">
                        <h2 className="about-section-title">Наши ценности</h2>
                        <div className="about-values__grid">
                            {values.map((value, index) => (
                                <div key={index} className="about-value-card glass-card">
                                    <div className="about-value-card__number">{String(index + 1).padStart(2, '0')}</div>
                                    <div className="about-value-card__text">{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Команда – слайдер */}
            {teamMembers.length > 0 && (
                <section className="about-team">
                    <div className="about-team__background"></div>
                    <div className="about-container">
                        <h2 className="about-section-title">Наша команда</h2>
                        <Swiper
                            modules={[Autoplay, Pagination, Navigation]}
                            spaceBetween={30}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 30 },
                            }}
                            autoplay={{ delay: 5000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            navigation={true}
                            className="about-team__swiper"
                        >
                            {teamMembers.map((member) => {
                                const imageStyles = {
                                    objectFit: member.imageSize || 'cover',
                                    objectPosition: member.imagePosition || 'center',
                                    transform: member.imageScale ? `scale(${member.imageScale})` : 'none',
                                };
                                return (
                                    <SwiperSlide key={member.id}>
                                        <div className="about-team-card glass-card">
                                            <div className="about-team-card__photo">
                                                {member.imageUrl ? (
                                                    <img
                                                        src={member.imageUrl}
                                                        alt={member.name}
                                                        loading="lazy"
                                                        style={imageStyles}
                                                    />
                                                ) : (
                                                    <div className="about-team-card__avatar">
                                                        {member.name
                                                            .split(' ')
                                                            .map((part: string) => part[0].toUpperCase())
                                                            .join('')}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="about-team-card__info">
                                                <h3 className="about-team-card__name">{member.name}</h3>
                                                <p className="about-team-card__position">{member.position}</p>
                                                <p className="about-team-card__description">{member.description}</p>
                                                {member.socialLinks && (
                                                    <div className="about-team-card__social">
                                                        {member.socialLinks.linkedin && (
                                                            <a
                                                                href={member.socialLinks.linkedin}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="about-social-link about-social-link--linkedin"
                                                                aria-label="LinkedIn"
                                                            ></a>
                                                        )}
                                                        {member.socialLinks.github && (
                                                            <a
                                                                href={member.socialLinks.github}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="about-social-link about-social-link--github"
                                                                aria-label="GitHub"
                                                            ></a>
                                                        )}
                                                        {member.socialLinks.telegram && (
                                                            <a
                                                                href={member.socialLinks.telegram}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="about-social-link about-social-link--telegram"
                                                                aria-label="Telegram"
                                                            ></a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </section>
            )}

            {/* Достижения – таймлайн */}
            {achievements.length > 0 && (
                <section className="about-achievements">
                    <div className="about-container">
                        <h2 className="about-section-title">Наши достижения</h2>
                        <div className="about-timeline">
                            {achievements.map((achievement, index) => (
                                <div key={achievement.id} className="about-timeline__item">
                                    <div className="about-timeline__dot"></div>
                                    {index < achievements.length - 1 && (
                                        <div className="about-timeline__line"></div>
                                    )}
                                    <div className="about-timeline__card glass-card">
                                        <span className="about-timeline__year">{achievement.year}</span>
                                        <h3 className="about-timeline__title">{achievement.title}</h3>
                                        <p className="about-timeline__description">{achievement.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default About;