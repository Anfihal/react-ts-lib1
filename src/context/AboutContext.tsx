// src/context/AboutContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AboutContent, AboutUpdateRequest, CompanyStat, TeamMember, Achievement } from '../types/AboutTypes';

interface AboutState {
    aboutContent: AboutContent | null;
    isLoading: boolean;
    error: string | null;
    isEditing: boolean;
}

type AboutAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'LOAD_ABOUT_CONTENT'; payload: AboutContent }
    | { type: 'UPDATE_ABOUT_CONTENT'; payload: AboutContent }
    | { type: 'SET_EDITING'; payload: boolean }
    | { type: 'ADD_STAT'; payload: CompanyStat }
    | { type: 'UPDATE_STAT'; payload: CompanyStat }
    | { type: 'DELETE_STAT'; payload: number }
    | { type: 'ADD_TEAM_MEMBER'; payload: TeamMember }
    | { type: 'UPDATE_TEAM_MEMBER'; payload: TeamMember }
    | { type: 'DELETE_TEAM_MEMBER'; payload: number }
    | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
    | { type: 'UPDATE_ACHIEVEMENT'; payload: Achievement }
    | { type: 'DELETE_ACHIEVEMENT'; payload: number };

interface AboutContextType {
    state: AboutState;
    updateAboutContent: (data: AboutUpdateRequest) => Promise<void>;
    setEditing: (editing: boolean) => void;
    addStat: (stat: Omit<CompanyStat, 'id'>) => void;
    updateStat: (stat: CompanyStat) => void;
    deleteStat: (id: number) => void;
    addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
    updateTeamMember: (member: TeamMember) => void;
    deleteTeamMember: (id: number) => void;
    addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
    updateAchievement: (achievement: Achievement) => void;
    deleteAchievement: (id: number) => void;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

const aboutReducer = (state: AboutState, action: AboutAction): AboutState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'LOAD_ABOUT_CONTENT':
            return { ...state, aboutContent: action.payload, error: null };
        case 'UPDATE_ABOUT_CONTENT':
            return { ...state, aboutContent: action.payload, error: null };
        case 'SET_EDITING':
            return { ...state, isEditing: action.payload };

        // Статистика
        case 'ADD_STAT':
            if (!state.aboutContent) return state;
            return {
                ...state,
                aboutContent: {
                    ...state.aboutContent,
                    stats: [...state.aboutContent.stats, action.payload],
                    updatedAt: new Date()
                }
            };
        case 'UPDATE_STAT':
            if (!state.aboutContent) return state;
            return {
                ...state,
                aboutContent: {
                    ...state.aboutContent,
                    stats: state.aboutContent.stats.map(stat =>
                        stat.id === action.payload.id ? action.payload : stat
                    ),
                    updatedAt: new Date()
                }
            };
        case 'DELETE_STAT':
            if (!state.aboutContent) return state;
            return {
                ...state,
                aboutContent: {
                    ...state.aboutContent,
                    stats: state.aboutContent.stats.filter(stat => stat.id !== action.payload),
                    updatedAt: new Date()
                }
            };

        // Команда
        case 'ADD_TEAM_MEMBER':
            if (!state.aboutContent) return state;
            return {
                ...state,
                aboutContent: {
                    ...state.aboutContent,
                    teamMembers: [...state.aboutContent.teamMembers, action.payload],
                    updatedAt: new Date()
                }
            };
        case 'UPDATE_TEAM_MEMBER':
            if (!state.aboutContent) return state;
            return {
                ...state,
                aboutContent: {
                    ...state.aboutContent,
                    teamMembers: state.aboutContent.teamMembers.map(member =>
                        member.id === action.payload.id ? action.payload : member
                    ),
                    updatedAt: new Date()
                }
            };
        case 'DELETE_TEAM_MEMBER':
            if (!state.aboutContent) return state;
            return {
                ...state,
                aboutContent: {
                    ...state.aboutContent,
                    teamMembers: state.aboutContent.teamMembers.filter(member => member.id !== action.payload),
                    updatedAt: new Date()
                }
            };

        // Достижения
        case 'ADD_ACHIEVEMENT':
            if (!state.aboutContent) return state;
            return {
                ...state,
                aboutContent: {
                    ...state.aboutContent,
                    achievements: [...state.aboutContent.achievements, action.payload],
                    updatedAt: new Date()
                }
            };
        case 'UPDATE_ACHIEVEMENT':
            if (!state.aboutContent) return state;
            return {
                ...state,
                aboutContent: {
                    ...state.aboutContent,
                    achievements: state.aboutContent.achievements.map(achievement =>
                        achievement.id === action.payload.id ? action.payload : achievement
                    ),
                    updatedAt: new Date()
                }
            };
        case 'DELETE_ACHIEVEMENT':
            if (!state.aboutContent) return state;
            return {
                ...state,
                aboutContent: {
                    ...state.aboutContent,
                    achievements: state.aboutContent.achievements.filter(achievement => achievement.id !== action.payload),
                    updatedAt: new Date()
                }
            };

        default:
            return state;
    }
};

const initialAboutContent: AboutContent = {
    id: '1',
    companyName: 'IT Solutions Pro',
    title: 'О нашей компании',
    subtitle: 'Создаем цифровые решения для бизнеса будущего',
    description: 'Мы - команда профессионалов, которая специализируется на создании современных веб-приложений, мобильных решений и комплексных IT-систем. Наша миссия - помогать бизнесу расти с помощью передовых технологий.',
    mission: 'Сделать передовые технологии доступными для бизнеса любого масштаба, обеспечивая качественные решения и превосходный сервис.',
    vision: 'Стать лидером в области цифровой трансформации, создавая инновационные продукты, которые меняют правила игры в различных отраслях.',
    values: [
        'Инновации и креативность',
        'Качество и надежность',
        'Клиентоориентированность',
        'Профессиональное развитие',
        'Командная работа'
    ],
    stats: [
        { id: 1, number: '5+', label: 'Лет опыта', icon: '🎯' },
        { id: 2, number: '150+', label: 'Завершенных проектов', icon: '🚀' },
        { id: 3, number: '50+', label: 'Довольных клиентов', icon: '❤️' },
        { id: 4, number: '15+', label: 'Профессионалов', icon: '👥' }
    ],
    teamMembers: [
        {
            id: 1,
            name: 'Александр Иванов',
            position: 'Генеральный директор',
            description: 'Основатель компании с 10-летним опытом в IT-индустрии',
            imageUrl: '/images/team/alexander.jpg',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/alexander',
                telegram: 'https://t.me/alexander'
            }
        },
        {
            id: 2,
            name: 'Мария Петрова',
            position: 'Технический директор',
            description: 'Эксперт в области веб-разработки и облачных технологий',
            imageUrl: '/images/team/maria.jpg',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/maria',
                github: 'https://github.com/maria'
            }
        },
        {
            id: 3,
            name: 'Дмитрий Сидоров',
            position: 'Lead Developer',
            description: 'Специализируется на React и Node.js разработке',
            imageUrl: '/images/team/dmitry.jpg',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/dmitry',
                github: 'https://github.com/dmitry'
            }
        },
        {
            id: 4,
            name: 'Елена Козлова',
            position: 'UI/UX Дизайнер',
            description: 'Создает интуитивные и красивые интерфейсы',
            imageUrl: '/images/team/elena.jpg',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/elena',
                telegram: 'https://t.me/elena'
            }
        }
    ],
    achievements: [
        {
            id: 1,
            year: '2020',
            title: 'Основание компании',
            description: 'Начали свой путь с небольшой команды энтузиастов',
            icon: '🏢'
        },
        {
            id: 2,
            year: '2021',
            title: 'Первые 50 проектов',
            description: 'Успешно завершили 50+ проектов для клиентов',
            icon: '🎉'
        },
        {
            id: 3,
            year: '2022',
            title: 'Расширение команды',
            description: 'Команда выросла до 15 профессионалов',
            icon: '👥'
        },
        {
            id: 4,
            year: '2023',
            title: 'Международные проекты',
            description: 'Начали работать с клиентами из Европы и США',
            icon: '🌍'
        },
        {
            id: 5,
            year: '2024',
            title: 'Инновации и рост',
            description: 'Запустили собственные SaaS продукты',
            icon: '🚀'
        }
    ],
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date()
};

export const AboutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(aboutReducer, {
        aboutContent: null,
        isLoading: false,
        error: null,
        isEditing: false
    });

    const updateAboutContent = async (data: AboutUpdateRequest): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedContent: AboutContent = {
                ...data,
                id: '1',
                createdAt: state.aboutContent?.createdAt || new Date(),
                updatedAt: new Date()
            };

            dispatch({ type: 'UPDATE_ABOUT_CONTENT', payload: updatedContent });
            dispatch({ type: 'SET_EDITING', payload: false });

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Ошибка при обновлении информации' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const setEditing = (editing: boolean) => {
        dispatch({ type: 'SET_EDITING', payload: editing });
    };

    // Методы для статистики
    const addStat = (stat: Omit<CompanyStat, 'id'>) => {
        const newId = Math.max(0, ...(state.aboutContent?.stats.map(s => s.id) || [])) + 1;
        dispatch({ type: 'ADD_STAT', payload: { ...stat, id: newId } });
    };

    const updateStat = (stat: CompanyStat) => {
        dispatch({ type: 'UPDATE_STAT', payload: stat });
    };

    const deleteStat = (id: number) => {
        dispatch({ type: 'DELETE_STAT', payload: id });
    };

    // Методы для команды
    const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
        const newId = Math.max(0, ...(state.aboutContent?.teamMembers.map(m => m.id) || [])) + 1;
        dispatch({ type: 'ADD_TEAM_MEMBER', payload: { ...member, id: newId } });
    };

    const updateTeamMember = (member: TeamMember) => {
        dispatch({ type: 'UPDATE_TEAM_MEMBER', payload: member });
    };

    const deleteTeamMember = (id: number) => {
        dispatch({ type: 'DELETE_TEAM_MEMBER', payload: id });
    };

    // Методы для достижений
    const addAchievement = (achievement: Omit<Achievement, 'id'>) => {
        const newId = Math.max(0, ...(state.aboutContent?.achievements.map(a => a.id) || [])) + 1;
        dispatch({ type: 'ADD_ACHIEVEMENT', payload: { ...achievement, id: newId } });
    };

    const updateAchievement = (achievement: Achievement) => {
        dispatch({ type: 'UPDATE_ACHIEVEMENT', payload: achievement });
    };

    const deleteAchievement = (id: number) => {
        dispatch({ type: 'DELETE_ACHIEVEMENT', payload: id });
    };

    useEffect(() => {
        dispatch({ type: 'LOAD_ABOUT_CONTENT', payload: initialAboutContent });
    }, []);

    const value: AboutContextType = {
        state,
        updateAboutContent,
        setEditing,
        addStat,
        updateStat,
        deleteStat,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        addAchievement,
        updateAchievement,
        deleteAchievement
    };

    return (
        <AboutContext.Provider value={value}>
            {children}
        </AboutContext.Provider>
    );
};

export const useAbout = (): AboutContextType => {
    const context = useContext(AboutContext);
    if (context === undefined) {
        throw new Error('useAbout must be used within an AboutProvider');
    }
    return context;
};