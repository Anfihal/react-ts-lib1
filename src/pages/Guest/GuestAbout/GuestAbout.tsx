// src/pages/About/About.tsx
import React from 'react';
import { useAbout } from '../../../context/AboutContext'
import './GuestAbout.css';

const About: React.FC = () => {
    const { state } = useAbout();

    if (!state.aboutContent) {
        return (
            <div className="about-page">
                <div className="loading">Загрузка информации...</div>
            </div>
        );
    }

    const {
        companyName,
        title,
        subtitle,
        description,
        mission,
        vision,
        values,
        stats,
        teamMembers,
        achievements
    } = state.aboutContent;

    return (
        <div className="about-page">
            {/* Герой секция */}
            <section className="hero-section">
                <div className="container">
                    <h1 className="hero-title">{companyName}</h1>
                    <h2 className="hero-subtitle">{title}</h2>
                    <p className="hero-description">{subtitle}</p>
                    <p className="hero-text">{description}</p>
                </div>
            </section>

            {/* Статистика */}
            {stats.length > 0 && (
                <section className="stats-section">
                    <div className="container">
                        <h2 className="section-title">Наша статистика</h2>
                        <div className="stats-grid">
                            {stats.map(stat => (
                                <div key={stat.id} className="stat-item">
                                    <div className="stat-icon">{stat.icon}</div>
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Миссия и видение */}
            <section className="mission-section">
                <div className="container">
                    <div className="mission-grid">
                        <div className="mission-card">
                            <h3>Наша миссия</h3>
                            <p>{mission}</p>
                        </div>
                        <div className="mission-card">
                            <h3>Наше видение</h3>
                            <p>{vision}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ценности */}
            {values.length > 0 && (
                <section className="values-section">
                    <div className="container">
                        <h2 className="section-title">Наши ценности</h2>
                        <div className="values-grid">
                            {values.map((value, index) => (
                                <div key={index} className="value-item">
                                    <div className="value-number">{index + 1}</div>
                                    <div className="value-text">{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Команда */}
            {teamMembers.length > 0 && (
                <section className="team-section">
                    <div className="container">
                        <h2 className="section-title">Наша команда</h2>
                        <div className="team-grid">
                            {teamMembers.map(member => (
                                <div key={member.id} className="team-member">
                                    <div className="member-photo">
                                        {member.imageUrl ? (
                                            <img src={member.imageUrl} alt={member.name} />
                                        ) : (
                                            <div className="member-avatar">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="member-info">
                                        <h3 className="member-name">{member.name}</h3>
                                        <p className="member-position">{member.position}</p>
                                        <p className="member-description">{member.description}</p>
                                        {member.socialLinks && (
                                            <div className="member-social">
                                                {member.socialLinks.linkedin && (
                                                    <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                                        LinkedIn
                                                    </a>
                                                )}
                                                {member.socialLinks.github && (
                                                    <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer">
                                                        GitHub
                                                    </a>
                                                )}
                                                {member.socialLinks.telegram && (
                                                    <a href={member.socialLinks.telegram} target="_blank" rel="noopener noreferrer">
                                                        Telegram
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Достижения */}
            {achievements.length > 0 && (
                <section className="achievements-section">
                    <div className="container">
                        <h2 className="section-title">Наши достижения</h2>
                        <div className="achievements-timeline">
                            {achievements.map(achievement => (
                                <div key={achievement.id} className="achievement-item">
                                    <div className="achievement-year">{achievement.year}</div>
                                    <div className="achievement-icon">{achievement.icon}</div>
                                    <div className="achievement-content">
                                        <h3>{achievement.title}</h3>
                                        <p>{achievement.description}</p>
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