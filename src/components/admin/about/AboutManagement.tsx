// src/components/admin/about/AboutManagement.tsx
import React, { useState, useEffect } from 'react';
import { useAbout } from '../../../context/AboutContext';
import type { AboutUpdateRequest, CompanyStat, TeamMember, Achievement } from '../../../types/AboutTypes';
import './AboutManagement.css';

const AboutManagement: React.FC = () => {
    const { state, updateAboutContent, setEditing, addStat, updateStat, deleteStat, addTeamMember, updateTeamMember, deleteTeamMember, addAchievement, updateAchievement, deleteAchievement } = useAbout();

    const [activeTab, setActiveTab] = useState<'general' | 'stats' | 'team' | 'achievements'>('general');
    const [formData, setFormData] = useState({
        companyName: '',
        title: '',
        subtitle: '',
        description: '',
        mission: '',
        vision: '',
        values: ''
    });

    // Формы для добавления новых элементов
    const [newStat, setNewStat] = useState({ number: '', label: '', icon: '' });
    const [newMember, setNewMember] = useState({
        name: '',
        position: '',
        description: '',
        imageUrl: '',
        linkedin: '',
        telegram: '',
        github: ''
    });
    const [newAchievement, setNewAchievement] = useState({ year: '', title: '', description: '', icon: '' });

    // Состояния для редактирования
    const [editingStat, setEditingStat] = useState<CompanyStat | null>(null);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

    useEffect(() => {
        if (state.aboutContent) {
            setFormData({
                companyName: state.aboutContent.companyName,
                title: state.aboutContent.title,
                subtitle: state.aboutContent.subtitle,
                description: state.aboutContent.description,
                mission: state.aboutContent.mission,
                vision: state.aboutContent.vision,
                values: state.aboutContent.values.join('\n')
            });
        }
    }, [state.aboutContent]);

    const handleGeneralSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!state.aboutContent) return;

        const updateData: AboutUpdateRequest = {
            ...state.aboutContent,
            companyName: formData.companyName,
            title: formData.title,
            subtitle: formData.subtitle,
            description: formData.description,
            mission: formData.mission,
            vision: formData.vision,
            values: formData.values.split('\n').filter(v => v.trim())
        };

        await updateAboutContent(updateData);
    };

    const handleAddStat = (e: React.FormEvent) => {
        e.preventDefault();
        addStat(newStat);
        setNewStat({ number: '', label: '', icon: '' });
    };

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        addTeamMember({
            name: newMember.name,
            position: newMember.position,
            description: newMember.description,
            imageUrl: newMember.imageUrl,
            socialLinks: {
                linkedin: newMember.linkedin || undefined,
                telegram: newMember.telegram || undefined,
                github: newMember.github || undefined
            }
        });
        setNewMember({ name: '', position: '', description: '', imageUrl: '', linkedin: '', telegram: '', github: '' });
    };

    const handleAddAchievement = (e: React.FormEvent) => {
        e.preventDefault();
        addAchievement(newAchievement);
        setNewAchievement({ year: '', title: '', description: '', icon: '' });
    };

    if (!state.aboutContent) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="about-management">
            <div className="about-header">
                <h2>Управление страницей "О нас"</h2>
                <div className="header-actions">
                    {!state.isEditing && (
                        <button className="edit-btn" onClick={() => setEditing(true)}>
                            ✏️ Редактировать
                        </button>
                    )}
                </div>
            </div>

            {state.error && (
                <div className="error-message">❌ {state.error}</div>
            )}

            {state.isEditing ? (
                <div className="edit-mode">
                    {/* Навигация по вкладкам */}
                    <div className="edit-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                            onClick={() => setActiveTab('general')}
                        >
                            Основная информация
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                            onClick={() => setActiveTab('stats')}
                        >
                            Статистика ({state.aboutContent.stats.length})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
                            onClick={() => setActiveTab('team')}
                        >
                            Команда ({state.aboutContent.teamMembers.length})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
                            onClick={() => setActiveTab('achievements')}
                        >
                            Достижения ({state.aboutContent.achievements.length})
                        </button>
                    </div>

                    {/* Основная информация */}
                    {activeTab === 'general' && (
                        <form className="about-form" onSubmit={handleGeneralSubmit}>
                            <div className="form-section">
                                <h3>Основная информация</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Название компании *</label>
                                        <input
                                            type="text"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Заголовок *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Подзаголовок *</label>
                                    <input
                                        type="text"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Описание компании *</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Миссия и видение</h3>
                                <div className="form-group">
                                    <label>Миссия *</label>
                                    <textarea
                                        value={formData.mission}
                                        onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                                        required
                                        rows={3}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Видение *</label>
                                    <textarea
                                        value={formData.vision}
                                        onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                                        required
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Ценности компании</h3>
                                <div className="form-group">
                                    <label>Ценности (каждая с новой строки) *</label>
                                    <textarea
                                        value={formData.values}
                                        onChange={(e) => setFormData({ ...formData, values: e.target.value })}
                                        required
                                        rows={5}
                                        placeholder="Инновации и креативность&#10;Качество и надежность&#10;Клиентоориентированность"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="save-btn" disabled={state.isLoading}>
                                    {state.isLoading ? 'Сохранение...' : '💾 Сохранить основную информацию'}
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>
                                    ❌ Отмена
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Управление статистикой */}
                    {activeTab === 'stats' && (
                        <div className="stats-management">
                            <h3>Управление статистикой</h3>

                            {/* Форма добавления статистики */}
                            <form onSubmit={handleAddStat} className="add-form">
                                <h4>Добавить статистику</h4>
                                <div className="form-row">
                                    <input
                                        type="text"
                                        placeholder="Число (5+)"
                                        value={newStat.number}
                                        onChange={(e) => setNewStat({ ...newStat, number: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Подпись"
                                        value={newStat.label}
                                        onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Иконка (эмодзи)"
                                        value={newStat.icon}
                                        onChange={(e) => setNewStat({ ...newStat, icon: e.target.value })}
                                        required
                                    />
                                    <button type="submit">➕ Добавить</button>
                                </div>
                            </form>

                            {/* Список статистики */}
                            <div className="items-list">
                                {state.aboutContent.stats.map(stat => (
                                    <div key={stat.id} className="item-card">
                                        {editingStat?.id === stat.id ? (
                                            <div className="edit-form">
                                                <input
                                                    type="text"
                                                    value={editingStat.number}
                                                    onChange={(e) => setEditingStat({ ...editingStat, number: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    value={editingStat.label}
                                                    onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    value={editingStat.icon}
                                                    onChange={(e) => setEditingStat({ ...editingStat, icon: e.target.value })}
                                                />
                                                <button onClick={() => {
                                                    updateStat(editingStat);
                                                    setEditingStat(null);
                                                }}>💾</button>
                                                <button onClick={() => setEditingStat(null)}>❌</button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="item-content">
                                                    <span className="stat-icon">{stat.icon}</span>
                                                    <div>
                                                        <strong>{stat.number}</strong>
                                                        <span>{stat.label}</span>
                                                    </div>
                                                </div>
                                                <div className="item-actions">
                                                    <button onClick={() => setEditingStat(stat)}>✏️</button>
                                                    <button onClick={() => deleteStat(stat.id)}>🗑️</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Управление командой */}
                    {activeTab === 'team' && (
                        <div className="team-management">
                            <h3>Управление командой</h3>

                            {/* Форма добавления члена команды */}
                            <form onSubmit={handleAddMember} className="add-form">
                                <h4>Добавить члена команды</h4>
                                <div className="form-grid">
                                    <input
                                        type="text"
                                        placeholder="Имя"
                                        value={newMember.name}
                                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Должность"
                                        value={newMember.position}
                                        onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="URL фото"
                                        value={newMember.imageUrl}
                                        onChange={(e) => setNewMember({ ...newMember, imageUrl: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Описание"
                                        value={newMember.description}
                                        onChange={(e) => setNewMember({ ...newMember, description: e.target.value })}
                                        required
                                        rows={3}
                                    />
                                    <input
                                        type="url"
                                        placeholder="LinkedIn URL"
                                        value={newMember.linkedin}
                                        onChange={(e) => setNewMember({ ...newMember, linkedin: e.target.value })}
                                    />
                                    <input
                                        type="url"
                                        placeholder="Telegram URL"
                                        value={newMember.telegram}
                                        onChange={(e) => setNewMember({ ...newMember, telegram: e.target.value })}
                                    />
                                    <input
                                        type="url"
                                        placeholder="GitHub URL"
                                        value={newMember.github}
                                        onChange={(e) => setNewMember({ ...newMember, github: e.target.value })}
                                    />
                                </div>
                                <button type="submit">➕ Добавить участника</button>
                            </form>

                            {/* Список команды */}
                            <div className="items-list">
                                {state.aboutContent.teamMembers.map(member => (
                                    <div key={member.id} className="item-card">
                                        {editingMember?.id === member.id ? (
                                            <div className="edit-form">
                                                <input
                                                    type="text"
                                                    value={editingMember.name}
                                                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    value={editingMember.position}
                                                    onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })}
                                                />
                                                <textarea
                                                    value={editingMember.description}
                                                    onChange={(e) => setEditingMember({ ...editingMember, description: e.target.value })}
                                                    rows={3}
                                                />
                                                <button onClick={() => {
                                                    updateTeamMember(editingMember);
                                                    setEditingMember(null);
                                                }}>💾</button>
                                                <button onClick={() => setEditingMember(null)}>❌</button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="item-content">
                                                    <div className="member-avatar">
                                                        {member.imageUrl ? '🖼️' : '👤'}
                                                    </div>
                                                    <div>
                                                        <h4>{member.name}</h4>
                                                        <p>{member.position}</p>
                                                        <span>{member.description}</span>
                                                    </div>
                                                </div>
                                                <div className="item-actions">
                                                    <button onClick={() => setEditingMember(member)}>✏️</button>
                                                    <button onClick={() => deleteTeamMember(member.id)}>🗑️</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Управление достижениями */}
                    {activeTab === 'achievements' && (
                        <div className="achievements-management">
                            <h3>Управление достижениями</h3>

                            {/* Форма добавления достижения */}
                            <form onSubmit={handleAddAchievement} className="add-form">
                                <h4>Добавить достижение</h4>
                                <div className="form-row">
                                    <input
                                        type="text"
                                        placeholder="Год"
                                        value={newAchievement.year}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Заголовок"
                                        value={newAchievement.title}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Описание"
                                        value={newAchievement.description}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Иконка (эмодзи)"
                                        value={newAchievement.icon}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, icon: e.target.value })}
                                        required
                                    />
                                    <button type="submit">➕ Добавить</button>
                                </div>
                            </form>

                            {/* Список достижений */}
                            <div className="items-list">
                                {state.aboutContent.achievements.map(achievement => (
                                    <div key={achievement.id} className="item-card">
                                        {editingAchievement?.id === achievement.id ? (
                                            <div className="edit-form">
                                                <input
                                                    type="text"
                                                    value={editingAchievement.year}
                                                    onChange={(e) => setEditingAchievement({ ...editingAchievement, year: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    value={editingAchievement.title}
                                                    onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    value={editingAchievement.description}
                                                    onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    value={editingAchievement.icon}
                                                    onChange={(e) => setEditingAchievement({ ...editingAchievement, icon: e.target.value })}
                                                />
                                                <button onClick={() => {
                                                    updateAchievement(editingAchievement);
                                                    setEditingAchievement(null);
                                                }}>💾</button>
                                                <button onClick={() => setEditingAchievement(null)}>❌</button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="item-content">
                                                    <span className="achievement-icon">{achievement.icon}</span>
                                                    <div>
                                                        <strong>{achievement.year} - {achievement.title}</strong>
                                                        <p>{achievement.description}</p>
                                                    </div>
                                                </div>
                                                <div className="item-actions">
                                                    <button onClick={() => setEditingAchievement(achievement)}>✏️</button>
                                                    <button onClick={() => deleteAchievement(achievement.id)}>🗑️</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="about-preview">
                    <div className="preview-section">
                        <h3>Основная информация</h3>
                        <div className="preview-content">
                            <h4>{state.aboutContent.companyName}</h4>
                            <h5>{state.aboutContent.title}</h5>
                            <p><strong>Подзаголовок:</strong> {state.aboutContent.subtitle}</p>
                            <p><strong>Описание:</strong> {state.aboutContent.description}</p>
                        </div>
                    </div>

                    <div className="preview-section">
                        <h3>Миссия и видение</h3>
                        <div className="preview-content">
                            <p><strong>Миссия:</strong> {state.aboutContent.mission}</p>
                            <p><strong>Видение:</strong> {state.aboutContent.vision}</p>
                        </div>
                    </div>

                    {state.aboutContent.values.length > 0 && (
                        <div className="preview-section">
                            <h3>Ценности компании</h3>
                            <div className="preview-content">
                                <ul className="values-list">
                                    {state.aboutContent.values.map((value, index) => (
                                        <li key={index}>{value}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {state.aboutContent.stats.length > 0 && (
                        <div className="preview-section">
                            <h3>Статистика ({state.aboutContent.stats.length} пунктов)</h3>
                            <div className="preview-stats-grid">
                                {state.aboutContent.stats.map(stat => (
                                    <div key={stat.id} className="preview-stat">
                                        <span className="preview-stat-icon">{stat.icon}</span>
                                        <span className="preview-stat-number">{stat.number}</span>
                                        <span className="preview-stat-label">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {state.aboutContent.teamMembers.length > 0 && (
                        <div className="preview-section">
                            <h3>Команда ({state.aboutContent.teamMembers.length} человек)</h3>
                            <div className="preview-team-grid">
                                {state.aboutContent.teamMembers.map(member => (
                                    <div key={member.id} className="preview-team-member">
                                        <div className="preview-member-avatar">
                                            {member.imageUrl ? (
                                                <img src={member.imageUrl} alt={member.name} />
                                            ) : (
                                                <div className="preview-member-initials">
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                            )}
                                        </div>
                                        <div className="preview-member-info">
                                            <h5>{member.name}</h5>
                                            <p className="preview-member-position">{member.position}</p>
                                            <span className="preview-member-description">{member.description}</span>
                                            {member.socialLinks && (
                                                <div className="preview-member-social">
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
                    )}

                    {state.aboutContent.achievements.length > 0 && (
                        <div className="preview-section">
                            <h3>Достижения ({state.aboutContent.achievements.length} событий)</h3>
                            <div className="preview-achievements">
                                {state.aboutContent.achievements.map(achievement => (
                                    <div key={achievement.id} className="preview-achievement">
                                        <div className="preview-achievement-year">{achievement.year}</div>
                                        <div className="preview-achievement-icon">{achievement.icon}</div>
                                        <div className="preview-achievement-content">
                                            <h4>{achievement.title}</h4>
                                            <p>{achievement.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="preview-footer">
                        <p className="last-updated">
                            Последнее обновление: {state.aboutContent.updatedAt.toLocaleString('ru-RU')}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutManagement;