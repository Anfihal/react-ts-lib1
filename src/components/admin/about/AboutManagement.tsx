import React, { useState, useEffect } from 'react';
import { useAbout } from '../../../context/AboutContext';
import type { AboutUpdateRequest, CompanyStat, TeamMember, Achievement } from '../../../types/AboutTypes';
import './AboutManagement.css';

const AboutManagement: React.FC = () => {
    const {
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
    } = useAbout();

    const [activeTab, setActiveTab] = useState<'general' | 'stats' | 'team' | 'achievements'>('general');
    const [showPreview, setShowPreview] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [previewType, setPreviewType] = useState<'public' | 'guest'>('public');

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
    const [newStat, setNewStat] = useState({ number: '', label: '' });
    const [newMember, setNewMember] = useState({
        name: '',
        position: '',
        description: '',
        imageUrl: '',
        imageFile: null as File | null,
        imagePreview: '',
        imagePosition: 'center' as 'top' | 'center' | 'bottom',
        imageSize: 'cover' as 'cover' | 'contain' | 'fill',
        imageScale: 1,
        linkedin: '',
        telegram: '',
        github: ''
    });
    const [newAchievement, setNewAchievement] = useState({ year: '', title: '', description: '' });

    // Состояния для редактирования
    const [editingStat, setEditingStat] = useState<CompanyStat | null>(null);
    const [editingMember, setEditingMember] = useState<TeamMember & {
        imageFile?: File | null,
        imagePreview?: string,
        imagePosition?: 'top' | 'center' | 'bottom',
        imageSize?: 'cover' | 'contain' | 'fill',
        imageScale?: number
    } | null>(null);
    const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

    // Состояние для редактора изображений в стиле Telegram
    const [imageEditor, setImageEditor] = useState<{
        isOpen: boolean;
        imageUrl: string;
        memberId?: number;
        isEditing: boolean;
        settings: {
            scale: number;
            positionX: number;
            positionY: number;
            objectFit: 'cover' | 'contain' | 'fill';
            objectPosition: 'top' | 'center' | 'bottom';
        }
    }>({
        isOpen: false,
        imageUrl: '',
        isEditing: false,
        settings: {
            scale: 1,
            positionX: 0,
            positionY: 0,
            objectFit: 'cover',
            objectPosition: 'center'
        }
    });

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

    // Управление статистикой
    const handleAddStat = (e: React.FormEvent) => {
        e.preventDefault();
        addStat(newStat);
        setNewStat({ number: '', label: '' });
    };

    const handleUpdateStat = () => {
        if (editingStat) {
            updateStat(editingStat);
            setEditingStat(null);
        }
    };

    // Управление командой с редактором изображений в стиле Telegram
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false, memberId?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите изображение');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Размер файла не должен превышать 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const imageUrl = reader.result as string;

            // Открываем редактор с изображением
            setImageEditor({
                isOpen: true,
                imageUrl: imageUrl,
                memberId: memberId,
                isEditing: isEditing,
                settings: {
                    scale: 1,
                    positionX: 0,
                    positionY: 0,
                    objectFit: 'cover',
                    objectPosition: 'center'
                }
            });

            if (isEditing && editingMember) {
                setEditingMember({
                    ...editingMember,
                    imageFile: file,
                    imagePreview: imageUrl
                });
            } else {
                setNewMember({
                    ...newMember,
                    imageFile: file,
                    imagePreview: imageUrl,
                    imageUrl: ''
                });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();

        let imageUrl = newMember.imageUrl;
        if (newMember.imagePreview) {
            imageUrl = newMember.imagePreview;
        }

        const memberData = {
            name: newMember.name,
            position: newMember.position,
            description: newMember.description,
            imageUrl: imageUrl,
            imagePosition: newMember.imagePosition,
            imageSize: newMember.imageSize,
            imageScale: newMember.imageScale || 1,
            socialLinks: {
                linkedin: newMember.linkedin || undefined,
                telegram: newMember.telegram || undefined,
                github: newMember.github || undefined
            }
        };

        addTeamMember(memberData as any);

        setNewMember({
            name: '',
            position: '',
            description: '',
            imageUrl: '',
            imageFile: null,
            imagePreview: '',
            imagePosition: 'center' as 'top' | 'center' | 'bottom',
            imageSize: 'cover' as 'cover' | 'contain' | 'fill',
            imageScale: 1,
            linkedin: '',
            telegram: '',
            github: ''
        });
    };

    const handleUpdateMember = () => {
        if (!editingMember) return;

        let imageUrl = editingMember.imageUrl;
        if (editingMember.imagePreview) {
            imageUrl = editingMember.imagePreview;
        }

        updateTeamMember({
            ...editingMember,
            imageUrl: imageUrl,
            imageSize: editingMember.imageSize,
            imagePosition: editingMember.imagePosition
        });
        setEditingMember(null);
    };

    // Управление достижениями
    const handleAddAchievement = (e: React.FormEvent) => {
        e.preventDefault();
        addAchievement(newAchievement);
        setNewAchievement({ year: '', title: '', description: '' });
    };

    const handleUpdateAchievement = () => {
        if (editingAchievement) {
            updateAchievement(editingAchievement);
            setEditingAchievement(null);
        }
    };

    // Компонент редактора изображений в стиле Telegram с полноценной обрезкой
    const ImageEditorModal = () => {
        if (!imageEditor.isOpen) return null;

        const PREVIEW_SIZE = 400; // Размер превью для удобства

        // Состояния для редактора
        const [isDragging, setIsDragging] = useState(false);
        const [isResizing, setIsResizing] = useState(false);
        const [resizeDirection, setResizeDirection] = useState<string | null>(null);
        const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
        const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
        const [dragStartSize, setDragStartSize] = useState({ width: 0, height: 0 });

        // Состояния для масштабирования
        const [pinchDistance, setPinchDistance] = useState<number | null>(null);
        const [pinchScale, setPinchScale] = useState(1);

        // Размеры области обрезки
        const [cropArea, setCropArea] = useState({
            x: 50,
            y: 50,
            width: 200,
            height: 200
        });

        // Масштаб изображения внутри контейнера
        const [imageScale, setImageScale] = useState(1);
        const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
        const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });

        // Загружаем изображение и получаем его натуральные размеры
        useEffect(() => {
            if (imageEditor.imageUrl) {
                const img = new Image();
                img.onload = () => {
                    setImageNaturalSize({
                        width: img.width,
                        height: img.height
                    });

                    // Автоматически подбираем масштаб и область обрезки
                    const scale = Math.min(
                        PREVIEW_SIZE / img.width,
                        PREVIEW_SIZE / img.height
                    ) * 0.8; // 80% от максимального размера для отступов

                    setImageScale(scale);

                    // Центрируем изображение
                    setImageOffset({
                        x: (PREVIEW_SIZE - img.width * scale) / 2,
                        y: (PREVIEW_SIZE - img.height * scale) / 2
                    });

                    // Устанавливаем начальную область обрезки по центру
                    setCropArea({
                        x: PREVIEW_SIZE / 2 - 100,
                        y: PREVIEW_SIZE / 2 - 100,
                        width: 200,
                        height: 200
                    });
                };
                img.src = imageEditor.imageUrl;
            }
        }, [imageEditor.imageUrl]);

        // Обработчики мыши для перетаскивания изображения
        const handleImageMouseDown = (e: React.MouseEvent) => {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
            setDragStartPos({ x: imageOffset.x, y: imageOffset.y });
        };

        const handleImageMouseMove = (e: React.MouseEvent) => {
            if (!isDragging) return;

            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;

            setImageOffset({
                x: dragStartPos.x + dx,
                y: dragStartPos.y + dy
            });
        };

        // Обработчики для изменения области обрезки
        const handleCropMouseDown = (e: React.MouseEvent, direction: string) => {
            e.preventDefault();
            e.stopPropagation();
            setIsResizing(true);
            setResizeDirection(direction);
            setDragStart({ x: e.clientX, y: e.clientY });
            setDragStartPos({ x: cropArea.x, y: cropArea.y });
            setDragStartSize({ width: cropArea.width, height: cropArea.height });
        };

        const handleCropMouseMove = (e: React.MouseEvent) => {
            if (!isResizing || !resizeDirection) return;

            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;

            let newX = cropArea.x;
            let newY = cropArea.y;
            let newWidth = cropArea.width;
            let newHeight = cropArea.height;

            // Обрабатываем разные направления изменения
            if (resizeDirection.includes('left')) {
                newX = dragStartPos.x + dx;
                newWidth = dragStartSize.width - dx;
            }
            if (resizeDirection.includes('right')) {
                newWidth = dragStartSize.width + dx;
            }
            if (resizeDirection.includes('top')) {
                newY = dragStartPos.y + dy;
                newHeight = dragStartSize.height - dy;
            }
            if (resizeDirection.includes('bottom')) {
                newHeight = dragStartSize.height + dy;
            }

            // Ограничения минимального размера
            newWidth = Math.max(50, Math.min(PREVIEW_SIZE, newWidth));
            newHeight = Math.max(50, Math.min(PREVIEW_SIZE, newHeight));
            newX = Math.max(0, Math.min(PREVIEW_SIZE - newWidth, newX));
            newY = Math.max(0, Math.min(PREVIEW_SIZE - newHeight, newY));

            setCropArea({
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight
            });
        };

        // Обработчики touch для мобильных устройств
        const handleTouchStart = (e: React.TouchEvent) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                // Один палец - перетаскивание изображения
                setIsDragging(true);
                setDragStart({
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                });
                setDragStartPos({ x: imageOffset.x, y: imageOffset.y });
            } else if (e.touches.length === 2) {
                // Два пальца - масштабирование
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const distance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                setPinchDistance(distance);
                setPinchScale(imageScale);
            }
        };

        const handleTouchMove = (e: React.TouchEvent) => {
            e.preventDefault();

            if (e.touches.length === 1 && isDragging) {
                // Перетаскивание одним пальцем
                const dx = e.touches[0].clientX - dragStart.x;
                const dy = e.touches[0].clientY - dragStart.y;

                setImageOffset({
                    x: dragStartPos.x + dx,
                    y: dragStartPos.y + dy
                });
            } else if (e.touches.length === 2 && pinchDistance) {
                // Масштабирование двумя пальцами
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const newDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );

                const scaleDelta = newDistance / pinchDistance;
                const newScale = Math.max(0.3, Math.min(3, pinchScale * scaleDelta));

                setImageScale(newScale);

                // Корректируем смещение, чтобы масштабирование было относительно центра
                setImageOffset({
                    x: imageOffset.x - (imageNaturalSize.width * (newScale - imageScale)) / 2,
                    y: imageOffset.y - (imageNaturalSize.height * (newScale - imageScale)) / 2
                });
            }
        };

        const handleTouchEnd = (e: React.TouchEvent) => {
            if (e.touches.length === 0) {
                setIsDragging(false);
                setPinchDistance(null);
            }
        };

        // Обработчик колесика мыши для масштабирования
        const handleWheel = (e: React.WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            const newScale = Math.max(0.3, Math.min(3, imageScale + delta));

            // Корректируем смещение, чтобы масштабирование было относительно курсора
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const worldX = (mouseX - imageOffset.x) / imageScale;
            const worldY = (mouseY - imageOffset.y) / imageScale;

            setImageScale(newScale);
            setImageOffset({
                x: mouseX - worldX * newScale,
                y: mouseY - worldY * newScale
            });
        };

        // Применение обрезки
        const applyCrop = () => {
            // Вычисляем реальные координаты обрезки на оригинальном изображении
            const cropX = (cropArea.x - imageOffset.x) / imageScale;
            const cropY = (cropArea.y - imageOffset.y) / imageScale;
            const cropWidth = cropArea.width / imageScale;
            const cropHeight = cropArea.height / imageScale;

            // Проверяем, что область обрезки находится в пределах изображения
            const validCrop = {
                x: Math.max(0, Math.min(imageNaturalSize.width - cropWidth, cropX)),
                y: Math.max(0, Math.min(imageNaturalSize.height - cropHeight, cropY)),
                width: Math.min(cropWidth, imageNaturalSize.width - cropX),
                height: Math.min(cropHeight, imageNaturalSize.height - cropY)
            };

            // Создаем canvas для обрезки
            const canvas = document.createElement('canvas');
            canvas.width = validCrop.width;
            canvas.height = validCrop.height;

            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = imageEditor.imageUrl;

            img.onload = () => {
                ctx?.drawImage(
                    img,
                    validCrop.x,
                    validCrop.y,
                    validCrop.width,
                    validCrop.height,
                    0,
                    0,
                    validCrop.width,
                    validCrop.height
                );

                // Получаем обрезанное изображение
                const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.92);

                // Определяем правильную позицию (определяем на основе cropArea)
                let imagePosition: 'top' | 'center' | 'bottom' = 'center';
                const relativeY = cropArea.y / PREVIEW_SIZE;
                if (relativeY < 0.3) imagePosition = 'top';
                else if (relativeY > 0.7) imagePosition = 'bottom';
                else imagePosition = 'center';

                // Определяем правильный размер
                const imageSize: 'cover' | 'contain' | 'fill' = 'cover';

                if (imageEditor.isEditing && imageEditor.memberId) {
                    const member = state.aboutContent?.teamMembers.find(m => m.id === imageEditor.memberId);
                    if (member) {
                        const updatedMember = {
                            ...member,
                            imageUrl: croppedImageUrl,
                            imageSize: imageSize,
                            imagePosition: imagePosition,
                            imageScale: 1
                        };
                        updateTeamMember(updatedMember);
                    }
                } else {
                    setNewMember({
                        ...newMember,
                        imagePreview: croppedImageUrl,
                        imageUrl: '',
                        imageSize: imageSize,
                        imagePosition: imagePosition,
                        imageScale: 1
                    });
                }

                setImageEditor({ ...imageEditor, isOpen: false });
            };
        };

        return (
            <div className="image-editor-overlay">
                <div className="image-editor-modal">
                    <div className="image-editor-header">
                        <h3>Редактор фото в стиле Telegram</h3>
                        <button className="close-editor" onClick={() => setImageEditor({ ...imageEditor, isOpen: false })} />
                    </div>

                    <div className="image-editor-preview">
                        <div
                            className="image-editor-container"
                            style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
                            onMouseDown={handleImageMouseDown}
                            onMouseMove={handleImageMouseMove}
                            onMouseUp={() => setIsDragging(false)}
                            onMouseLeave={() => setIsDragging(false)}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onWheel={handleWheel}
                        >
                            <img
                                src={imageEditor.imageUrl}
                                alt="Preview"
                                style={{
                                    position: 'absolute',
                                    left: imageOffset.x,
                                    top: imageOffset.y,
                                    width: imageNaturalSize.width * imageScale,
                                    height: imageNaturalSize.height * imageScale,
                                    cursor: isDragging ? 'grabbing' : 'grab'
                                }}
                            />

                            {/* Область обрезки */}
                            <div
                                className="crop-area"
                                style={{
                                    left: cropArea.x,
                                    top: cropArea.y,
                                    width: cropArea.width,
                                    height: cropArea.height
                                }}
                                onMouseMove={handleCropMouseMove}
                                onMouseUp={() => setIsResizing(false)}
                                onMouseLeave={() => setIsResizing(false)}
                            >
                                {/* Углы для изменения размера */}
                                <div
                                    className="crop-handle crop-handle-nw"
                                    onMouseDown={(e) => handleCropMouseDown(e, 'top-left')}
                                />
                                <div
                                    className="crop-handle crop-handle-ne"
                                    onMouseDown={(e) => handleCropMouseDown(e, 'top-right')}
                                />
                                <div
                                    className="crop-handle crop-handle-sw"
                                    onMouseDown={(e) => handleCropMouseDown(e, 'bottom-left')}
                                />
                                <div
                                    className="crop-handle crop-handle-se"
                                    onMouseDown={(e) => handleCropMouseDown(e, 'bottom-right')}
                                />

                                {/* Стороны для изменения размера */}
                                <div
                                    className="crop-edge crop-edge-top"
                                    onMouseDown={(e) => handleCropMouseDown(e, 'top')}
                                />
                                <div
                                    className="crop-edge crop-edge-right"
                                    onMouseDown={(e) => handleCropMouseDown(e, 'right')}
                                />
                                <div
                                    className="crop-edge crop-edge-bottom"
                                    onMouseDown={(e) => handleCropMouseDown(e, 'bottom')}
                                />
                                <div
                                    className="crop-edge crop-edge-left"
                                    onMouseDown={(e) => handleCropMouseDown(e, 'left')}
                                />

                                {/* Текст с размерами */}
                                <div className="crop-size">
                                    {Math.round(cropArea.width)} x {Math.round(cropArea.height)}
                                </div>
                            </div>

                            {/* Затемнение вне области обрезки */}
                            <div className="crop-overlay" />

                            <div className="preview-size-indicator">
                                {PREVIEW_SIZE}x{PREVIEW_SIZE}
                            </div>
                            <div className="telegram-size-info">
                                {Math.round(cropArea.width)}x{Math.round(cropArea.height)}
                            </div>
                        </div>
                    </div>

                    <div className="image-editor-controls">
                        <div className="control-group">
                            <label>Управление изображением:</label>
                            <div className="gesture-hint">
                                <span>Перетаскивание - двигать изображение</span>
                                <span>Колесико - масштаб</span>
                                <span>Два пальца - масштаб на телефоне</span>
                            </div>
                        </div>

                        <div className="control-group">
                            <label>Область обрезки:</label>
                            <div className="gesture-hint">
                                <span>Тяните за углы и стороны</span>
                                <span>Минимальный размер: 50x50 px</span>
                            </div>
                        </div>

                        <div className="control-group">
                            <label>Масштаб: {Math.round(imageScale * 100)}%</label>
                            <input
                                type="range"
                                min="30"
                                max="300"
                                step="1"
                                value={Math.round(imageScale * 100)}
                                onChange={(e) => {
                                    const newScale = parseInt(e.target.value) / 100;
                                    setImageScale(newScale);
                                }}
                            />
                            <div className="range-values">
                                <span>30%</span>
                                <span>100%</span>
                                <span>300%</span>
                            </div>
                        </div>

                        <div className="control-group">
                            <label>Размер обрезки: {Math.round(cropArea.width)} x {Math.round(cropArea.height)} px</label>
                            <div className="crop-presets">
                                <button onClick={() => setCropArea({ ...cropArea, width: 200, height: 200 })}>
                                    200x200
                                </button>
                                <button onClick={() => setCropArea({ ...cropArea, width: 300, height: 300 })}>
                                    300x300
                                </button>
                                <button onClick={() => setCropArea({ ...cropArea, width: 400, height: 400 })}>
                                    400x400
                                </button>
                                <button onClick={() => {
                                    const size = Math.min(cropArea.width, cropArea.height);
                                    setCropArea({
                                        x: cropArea.x + (cropArea.width - size) / 2,
                                        y: cropArea.y + (cropArea.height - size) / 2,
                                        width: size,
                                        height: size
                                    });
                                }}>
                                    Квадрат
                                </button>
                            </div>
                        </div>

                        <div className="control-group">
                            <button className="reset-button" onClick={() => {
                                const scale = Math.min(
                                    PREVIEW_SIZE / imageNaturalSize.width,
                                    PREVIEW_SIZE / imageNaturalSize.height
                                ) * 0.8;
                                setImageScale(scale);
                                setImageOffset({
                                    x: (PREVIEW_SIZE - imageNaturalSize.width * scale) / 2,
                                    y: (PREVIEW_SIZE - imageNaturalSize.height * scale) / 2
                                });
                                setCropArea({
                                    x: PREVIEW_SIZE / 2 - 100,
                                    y: PREVIEW_SIZE / 2 - 100,
                                    width: 200,
                                    height: 200
                                });
                            }}>
                                Сбросить все настройки
                            </button>
                        </div>

                        <div className="telegram-note">
                            <p>Telegram автоматически сжимает фото до 1280px по большей стороне</p>
                            <p>Рекомендуемый формат: JPEG, качество 92%</p>
                            <p>Итоговое фото будет обрезано по выделенной области</p>
                        </div>
                    </div>

                    <div className="image-editor-footer">
                        <button className="cancel-btn" onClick={() => setImageEditor({ ...imageEditor, isOpen: false })}>Отмена</button>
                        <button className="save-btn" onClick={applyCrop}>Применить обрезку</button>
                    </div>
                </div>
            </div>
        );
    };

    // Компонент предпросмотра страницы для публичной версии
    const PublicPreview = () => (
        <div className={`about - page ${previewMode === 'mobile' ? 'mobile-view' : ''} `}>
            {/* Герой секция */}
            <section className="about-hero">
                <div className="about-hero__overlay"></div>
                <div className="about-container">
                    <div className="about-hero__content glass-card">
                        <h1 className="about-hero__title">{formData.companyName || 'Название компании'}</h1>
                        <h2 className="about-hero__subtitle">{formData.title || 'Заголовок'}</h2>
                        <p className="about-hero__description">{formData.subtitle || 'Подзаголовок'}</p>
                        <p className="about-hero__text">{formData.description || 'Описание компании'}</p>
                    </div>
                </div>
            </section>

            {/* Статистика */}
            {state.aboutContent?.stats && state.aboutContent.stats.length > 0 && (
                <section className="about-stats">
                    <div className="about-container">
                        <h2 className="about-section-title">Наша статистика</h2>
                        <div className="about-stats__grid">
                            {state.aboutContent.stats.map((stat: CompanyStat) => (
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
                            <div className="about-mission-card__icon about-mission-card__icon--target" />
                            <h3 className="about-mission-card__title">Наша миссия</h3>
                            <p className="about-mission-card__text">{formData.mission || 'Миссия компании'}</p>
                        </div>
                        <div className="about-mission-card glass-card">
                            <div className="about-mission-card__icon about-mission-card__icon--vision" />
                            <h3 className="about-mission-card__title">Наше видение</h3>
                            <p className="about-mission-card__text">{formData.vision || 'Видение компании'}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ценности */}
            {formData.values && formData.values.trim() !== '' && (
                <section className="about-values">
                    <div className="about-container">
                        <h2 className="about-section-title">Наши ценности</h2>
                        <div className="about-values__grid">
                            {formData.values.split('\n').filter((v: string) => v.trim()).map((value: string, index: number) => (
                                <div key={index} className="about-value-card glass-card">
                                    <div className="about-value-card__number">{String(index + 1).padStart(2, '0')}</div>
                                    <div className="about-value-card__text">{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Команда */}
            {state.aboutContent?.teamMembers && state.aboutContent.teamMembers.length > 0 && (
                <section className="about-team">
                    <div className="about-team__background"></div>
                    <div className="about-container">
                        <h2 className="about-section-title">Наша команда</h2>
                        <div className="about-team__grid">
                            {state.aboutContent.teamMembers.map((member: TeamMember) => {
                                const imageStyles = {
                                    objectFit: member.imageSize || 'cover',
                                    objectPosition: member.imagePosition || 'center',
                                    transform: member.imageScale ? `scale(${member.imageScale})` : 'none'
                                };

                                return (
                                    <div key={member.id} className="about-team-card glass-card">
                                        <div className="about-team-card__photo">
                                            {member.imageUrl ? (
                                                <img
                                                    src={member.imageUrl}
                                                    alt={member.name}
                                                    style={imageStyles}
                                                />
                                            ) : (
                                                <div className="about-team-card__avatar">
                                                    {member.name.split(' ').map((n: string) => n[0]).join('')}
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
                                                        />
                                                    )}
                                                    {member.socialLinks.github && (
                                                        <a
                                                            href={member.socialLinks.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="about-social-link about-social-link--github"
                                                            aria-label="GitHub"
                                                        />
                                                    )}
                                                    {member.socialLinks.telegram && (
                                                        <a
                                                            href={member.socialLinks.telegram}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="about-social-link about-social-link--telegram"
                                                            aria-label="Telegram"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Достижения */}
            {state.aboutContent?.achievements && state.aboutContent.achievements.length > 0 && (
                <section className="about-achievements">
                    <div className="about-container">
                        <h2 className="about-section-title">Наши достижения</h2>
                        <div className="about-timeline">
                            {state.aboutContent.achievements.map((achievement: Achievement, index: number) => (
                                <div key={achievement.id} className="about-timeline__item">
                                    <div className="about-timeline__dot" />
                                    {index < state.aboutContent!.achievements.length - 1 && (
                                        <div className="about-timeline__line" />
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

    // Компонент предпросмотра страницы для гостевой версии
    const GuestPreview = () => (
        <div className={`guest - about - page ${previewMode === 'mobile' ? 'mobile-view' : ''} `}>
            {/* Герой секция */}
            <section className="guest-hero">
                <div className="guest-hero__overlay"></div>
                <div className="guest-container">
                    <div className="guest-hero__content guest-glass-card">
                        <h1 className="guest-hero__title">{formData.companyName || 'Название компании'}</h1>
                        <h2 className="guest-hero__subtitle">{formData.title || 'Заголовок'}</h2>
                        <p className="guest-hero__description">{formData.subtitle || 'Подзаголовок'}</p>
                        <p className="guest-hero__text">{formData.description || 'Описание компании'}</p>
                    </div>
                </div>
            </section>

            {/* Статистика */}
            {state.aboutContent?.stats && state.aboutContent.stats.length > 0 && (
                <section className="guest-stats">
                    <div className="guest-container">
                        <h2 className="guest-section-title">Наша статистика</h2>
                        <div className="guest-stats__grid">
                            {state.aboutContent.stats.map((stat: CompanyStat) => (
                                <div key={stat.id} className="guest-stat-card guest-glass-card">
                                    <div className="guest-stat-card__number">{stat.number}</div>
                                    <div className="guest-stat-card__label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Миссия и видение */}
            <section className="guest-mission">
                <div className="guest-container">
                    <div className="guest-mission__grid">
                        <div className="guest-mission-card guest-glass-card">
                            <div className="guest-mission-card__icon guest-mission-card__icon--target" />
                            <h3 className="guest-mission-card__title">Наша миссия</h3>
                            <p className="guest-mission-card__text">{formData.mission || 'Миссия компании'}</p>
                        </div>
                        <div className="guest-mission-card guest-glass-card">
                            <div className="guest-mission-card__icon guest-mission-card__icon--vision" />
                            <h3 className="guest-mission-card__title">Наше видение</h3>
                            <p className="guest-mission-card__text">{formData.vision || 'Видение компании'}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ценности */}
            {formData.values && formData.values.trim() !== '' && (
                <section className="guest-values">
                    <div className="guest-container">
                        <h2 className="guest-section-title">Наши ценности</h2>
                        <div className="guest-values__grid">
                            {formData.values.split('\n').filter((v: string) => v.trim()).map((value: string, index: number) => (
                                <div key={index} className="guest-value-card guest-glass-card">
                                    <div className="guest-value-card__number">{String(index + 1).padStart(2, '0')}</div>
                                    <div className="guest-value-card__text">{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Команда */}
            {state.aboutContent?.teamMembers && state.aboutContent.teamMembers.length > 0 && (
                <section className="guest-team">
                    <div className="guest-team__background"></div>
                    <div className="guest-container">
                        <h2 className="guest-section-title">Наша команда</h2>
                        <div className="guest-team__grid">
                            {state.aboutContent.teamMembers.map((member: TeamMember) => {
                                const imageStyles = {
                                    objectFit: member.imageSize || 'cover',
                                    objectPosition: member.imagePosition || 'center',
                                    transform: member.imageScale ? `scale(${member.imageScale})` : 'none'
                                };

                                return (
                                    <div key={member.id} className="guest-team-card guest-glass-card">
                                        <div className="guest-team-card__photo">
                                            {member.imageUrl ? (
                                                <img
                                                    src={member.imageUrl}
                                                    alt={member.name}
                                                    style={imageStyles}
                                                />
                                            ) : (
                                                <div className="guest-team-card__avatar">
                                                    {member.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                            )}
                                        </div>
                                        <div className="guest-team-card__info">
                                            <h3 className="guest-team-card__name">{member.name}</h3>
                                            <p className="guest-team-card__position">{member.position}</p>
                                            <p className="guest-team-card__description">{member.description}</p>
                                            {member.socialLinks && (
                                                <div className="guest-team-card__social">
                                                    {member.socialLinks.linkedin && (
                                                        <a
                                                            href={member.socialLinks.linkedin}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="guest-social-link guest-social-link--linkedin"
                                                            aria-label="LinkedIn"
                                                        />
                                                    )}
                                                    {member.socialLinks.github && (
                                                        <a
                                                            href={member.socialLinks.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="guest-social-link guest-social-link--github"
                                                            aria-label="GitHub"
                                                        />
                                                    )}
                                                    {member.socialLinks.telegram && (
                                                        <a
                                                            href={member.socialLinks.telegram}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="guest-social-link guest-social-link--telegram"
                                                            aria-label="Telegram"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Достижения */}
            {state.aboutContent?.achievements && state.aboutContent.achievements.length > 0 && (
                <section className="guest-achievements">
                    <div className="guest-container">
                        <h2 className="guest-section-title">Наши достижения</h2>
                        <div className="guest-timeline">
                            {state.aboutContent.achievements.map((achievement: Achievement, index: number) => (
                                <div key={achievement.id} className="guest-timeline__item">
                                    <div className="guest-timeline__dot" />
                                    {index < state.aboutContent!.achievements.length - 1 && (
                                        <div className="guest-timeline__line" />
                                    )}
                                    <div className="guest-timeline__card guest-glass-card">
                                        <span className="guest-timeline__year">{achievement.year}</span>
                                        <h3 className="guest-timeline__title">{achievement.title}</h3>
                                        <p className="guest-timeline__description">{achievement.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );

    // Компонент предпросмотра страницы
    const PreviewWindow = () => {
        if (!showPreview) return null;

        return (
            <div className={`preview - overlay ${previewMode === 'mobile' ? 'mobile-preview' : ''} `}>
                <div className="preview-header">
                    <h3>Предпросмотр страницы</h3>
                    <div className="preview-controls">
                        <div className="preview-type-selector">
                            <button
                                className={`preview - type - btn ${previewType === 'public' ? 'active' : ''} `}
                                onClick={() => setPreviewType('public')}
                            >
                                Публичная
                            </button>
                            <button
                                className={`preview - type - btn ${previewType === 'guest' ? 'active' : ''} `}
                                onClick={() => setPreviewType('guest')}
                            >
                                Гостевая
                            </button>
                        </div>
                        <button
                            className={`preview - mode - btn ${previewMode === 'desktop' ? 'active' : ''} `}
                            onClick={() => setPreviewMode('desktop')}
                        >
                            Десктоп
                        </button>
                        <button
                            className={`preview - mode - btn ${previewMode === 'mobile' ? 'active' : ''} `}
                            onClick={() => setPreviewMode('mobile')}
                        >
                            Мобильный
                        </button>
                        <button className="close-preview" onClick={() => setShowPreview(false)} />
                    </div>
                </div>
                <div className={`preview - content ${previewMode === 'mobile' ? 'mobile-view' : ''} `}>
                    {previewType === 'public' ? <PublicPreview /> : <GuestPreview />}
                </div>
            </div>
        );
    };

    if (!state.aboutContent) {
        return <div className="about-management-loading">Загрузка...</div>;
    }

    return (
        <div className="about-management">
            <ImageEditorModal />
            <PreviewWindow />

            <div className="about-header">
                <h2>Управление страницей "О нас"</h2>
                <div className="header-actions">
                    {!state.isEditing && (
                        <button className="edit-btn" onClick={() => setEditing(true)} />
                    )}
                    {state.isEditing && (
                        <button className="preview-btn" onClick={() => setShowPreview(true)} />
                    )}
                </div>
            </div>

            {state.error && (
                <div className="error-message">{state.error}</div>
            )}

            {state.isEditing ? (
                <div className="edit-mode">
                    {/* Навигация по вкладкам */}
                    <div className="edit-tabs">
                        <button
                            className={`tab - btn ${activeTab === 'general' ? 'active' : ''} `}
                            onClick={() => setActiveTab('general')}
                        >
                            Основная информация
                        </button>
                        <button
                            className={`tab - btn ${activeTab === 'stats' ? 'active' : ''} `}
                            onClick={() => setActiveTab('stats')}
                        >
                            Статистика ({state.aboutContent.stats.length})
                        </button>
                        <button
                            className={`tab - btn ${activeTab === 'team' ? 'active' : ''} `}
                            onClick={() => setActiveTab('team')}
                        >
                            Команда ({state.aboutContent.teamMembers.length})
                        </button>
                        <button
                            className={`tab - btn ${activeTab === 'achievements' ? 'active' : ''} `}
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
                                        placeholder="Инновации и креативность\nКачество и надежность\nКлиентоориентированность"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="save-btn" disabled={state.isLoading}>
                                    {state.isLoading ? 'Сохранение...' : 'Сохранить основную информацию'}
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>
                                    Отмена
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Управление статистикой */}
                    {activeTab === 'stats' && (
                        <div className="stats-management">
                            <h3>Управление статистикой</h3>

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
                                    <button type="submit">Добавить</button>
                                </div>
                            </form>

                            <div className="items-list">
                                {state.aboutContent.stats.map((stat: CompanyStat) => (
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
                                                <div className="edit-actions">
                                                    <button onClick={handleUpdateStat} className="save-btn" />
                                                    <button onClick={() => setEditingStat(null)} className="cancel-btn" />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="item-content">
                                                    <strong>{stat.number}</strong> - {stat.label}
                                                </div>
                                                <div className="item-actions">
                                                    <button onClick={() => setEditingStat(stat)} />
                                                    <button onClick={() => deleteStat(stat.id)} />
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

                            <form onSubmit={handleAddMember} className="add-form">
                                <h4>Добавить члена команды</h4>
                                <div className="form-grid">
                                    <input
                                        type="text"
                                        placeholder="Имя *"
                                        value={newMember.name}
                                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Должность *"
                                        value={newMember.position}
                                        onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                                        required
                                    />

                                    <div className="form-group file-upload">
                                        <label>Фото участника:</label>
                                        <div className="file-input-container">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, false)}
                                                id="member-photo"
                                            />
                                            <label htmlFor="member-photo" className="file-input-label">
                                                {newMember.imagePreview ? 'Фото выбрано' : 'Выбрать фото'}
                                            </label>
                                        </div>

                                        {newMember.imagePreview && (
                                            <>
                                                <div className="image-preview">
                                                    <img
                                                        src={newMember.imagePreview}
                                                        alt="Preview"
                                                        style={{
                                                            objectFit: newMember.imageSize,
                                                            objectPosition: newMember.imagePosition,
                                                            transform: `scale(${newMember.imageScale})`
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="remove-image"
                                                        onClick={() => setNewMember({
                                                            ...newMember,
                                                            imageFile: null,
                                                            imagePreview: '',
                                                            imageUrl: ''
                                                        })}
                                                    />
                                                </div>

                                                <div className="image-settings">
                                                    <div className="setting-group">
                                                        <label>Позиция:</label>
                                                        <select
                                                            value={newMember.imagePosition}
                                                            onChange={(e) => setNewMember({
                                                                ...newMember,
                                                                imagePosition: e.target.value as 'top' | 'center' | 'bottom'
                                                            })}
                                                        >
                                                            <option value="top">Сверху</option>
                                                            <option value="center">Центр</option>
                                                            <option value="bottom">Снизу</option>
                                                        </select>
                                                    </div>
                                                    <div className="setting-group">
                                                        <label>Размер:</label>
                                                        <select
                                                            value={newMember.imageSize}
                                                            onChange={(e) => setNewMember({
                                                                ...newMember,
                                                                imageSize: e.target.value as 'cover' | 'contain' | 'fill'
                                                            })}
                                                        >
                                                            <option value="cover">Cover (заполнить)</option>
                                                            <option value="contain">Contain (вписать)</option>
                                                            <option value="fill">Fill (растянуть)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="or-divider">или</div>
                                        <input
                                            type="url"
                                            placeholder="URL фото (если нет файла)"
                                            value={newMember.imageUrl}
                                            onChange={(e) => setNewMember({ ...newMember, imageUrl: e.target.value })}
                                        />
                                    </div>

                                    <textarea
                                        placeholder="Описание *"
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
                                <button type="submit" className="add-btn">Добавить участника</button>
                            </form>

                            <div className="items-list">
                                <h4>Существующие участники</h4>
                                {state.aboutContent.teamMembers.map((member: TeamMember) => (
                                    <div key={member.id} className="item-card">
                                        {editingMember?.id === member.id ? (
                                            <div className="edit-form">
                                                <input
                                                    type="text"
                                                    value={editingMember.name}
                                                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                                                    placeholder="Имя"
                                                />
                                                <input
                                                    type="text"
                                                    value={editingMember.position}
                                                    onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })}
                                                    placeholder="Должность"
                                                />

                                                <div className="form-group file-upload">
                                                    <label>Фото участника:</label>
                                                    <div className="file-input-container">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleImageChange(e, true, member.id)}
                                                            id={`edit - member - photo - ${member.id} `}
                                                        />
                                                        <label htmlFor={`edit - member - photo - ${member.id} `} className="file-input-label">
                                                            {editingMember.imagePreview ? 'Фото выбрано' : 'Изменить фото'}
                                                        </label>
                                                    </div>

                                                    {(editingMember.imagePreview || editingMember.imageUrl) && (
                                                        <>
                                                            <div className="image-preview">
                                                                <img
                                                                    src={editingMember.imagePreview || editingMember.imageUrl}
                                                                    alt="Preview"
                                                                    style={{
                                                                        objectFit: editingMember.imageSize || 'cover',
                                                                        objectPosition: editingMember.imagePosition || 'center',
                                                                        transform: `scale(${editingMember.imageScale || 1})`
                                                                    }}
                                                                />
                                                            </div>

                                                            {member.imageUrl && (
                                                                <button
                                                                    className="edit-photo-btn"
                                                                    onClick={() => {
                                                                        setImageEditor({
                                                                            isOpen: true,
                                                                            imageUrl: member.imageUrl,
                                                                            memberId: member.id,
                                                                            isEditing: true,
                                                                            settings: {
                                                                                scale: (member as any).imageScale || 1,
                                                                                positionX: 0,
                                                                                positionY: 0,
                                                                                objectFit: ((member as any).imageSize as 'cover' | 'contain' | 'fill') || 'cover',
                                                                                objectPosition: ((member as any).imagePosition as 'top' | 'center' | 'bottom') || 'center'
                                                                            }
                                                                        });
                                                                    }}
                                                                />
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                <textarea
                                                    value={editingMember.description}
                                                    onChange={(e) => setEditingMember({ ...editingMember, description: e.target.value })}
                                                    rows={3}
                                                    placeholder="Описание"
                                                />
                                                <div className="edit-actions">
                                                    <button onClick={handleUpdateMember} className="save-btn">Сохранить</button>
                                                    <button onClick={() => setEditingMember(null)} className="cancel-btn">Отмена</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="item-content">
                                                    <div className="member-avatar">
                                                        {member.imageUrl ? (
                                                            <img
                                                                src={member.imageUrl}
                                                                alt={member.name}
                                                                style={{
                                                                    objectFit: member.imageSize || 'cover',
                                                                    objectPosition: member.imagePosition || 'center',
                                                                    transform: member.imageScale ? `scale(${member.imageScale})` : 'none'
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="avatar-placeholder">
                                                                {member.name.split(' ').map((n: string) => n[0]).join('')}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="member-details">
                                                        <h4>{member.name}</h4>
                                                        <p className="member-position">{member.position}</p>
                                                        <span className="member-description">{member.description}</span>
                                                        {member.socialLinks && (
                                                            <div className="member-social">
                                                                {member.socialLinks.linkedin && <span className="linkedin" />}
                                                                {member.socialLinks.github && <span className="github" />}
                                                                {member.socialLinks.telegram && <span className="telegram" />}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="item-actions">
                                                    <button onClick={() => setEditingMember({
                                                        ...member,
                                                        imageFile: null,
                                                        imagePreview: '',
                                                        imagePosition: member.imagePosition || 'center',
                                                        imageSize: member.imageSize || 'cover',
                                                        imageScale: member.imageScale || 1
                                                    })} />
                                                    <button onClick={() => deleteTeamMember(member.id)} />
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
                                    <button type="submit">Добавить</button>
                                </div>
                            </form>

                            <div className="items-list">
                                {state.aboutContent.achievements.map((achievement: Achievement) => (
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
                                                <div className="edit-actions">
                                                    <button onClick={handleUpdateAchievement} className="save-btn" />
                                                    <button onClick={() => setEditingAchievement(null)} className="cancel-btn" />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="item-content">
                                                    <strong>{achievement.year} - {achievement.title}</strong>
                                                    <p>{achievement.description}</p>
                                                </div>
                                                <div className="item-actions">
                                                    <button onClick={() => setEditingAchievement(achievement)} />
                                                    <button onClick={() => deleteAchievement(achievement.id)} />
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
                                {state.aboutContent.teamMembers.map(member => {
                                    const imageStyles = {
                                        objectFit: member.imageSize || 'cover',
                                        objectPosition: (member.imagePosition ?? 'center') as 'top' | 'center' | 'bottom',
                                        transform: member.imageScale ? `scale(${member.imageScale})` : 'none'
                                    };

                                    return (
                                        <div key={member.id} className="preview-team-member">
                                            <div className="preview-member-avatar">
                                                {member.imageUrl ? (
                                                    <img src={member.imageUrl} alt={member.name} style={imageStyles} />
                                                ) : (
                                                    <div className="preview-member-initials">
                                                        {member.name.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="preview-member-info">
                                                <h5>{member.name}</h5>
                                                <p className="preview-member-position">{member.position}</p>
                                                <span className="preview-member-description">{member.description}</span>
                                                {member.socialLinks && (
                                                    <div className="preview-member-social">
                                                        {member.socialLinks.linkedin && <span className="linkedin" />}
                                                        {member.socialLinks.github && <span className="github" />}
                                                        {member.socialLinks.telegram && <span className="telegram" />}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
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
                            Последнее обновление: {new Date(state.aboutContent.updatedAt).toLocaleString('ru-RU')}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutManagement;
