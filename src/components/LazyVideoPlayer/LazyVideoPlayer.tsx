// src/components/LazyVideoPlayer/LazyVideoPlayer.tsx
import React, { useState, useRef } from 'react';
import './LazyVideoPlayer.css'; // Небольшой файл стилей для плеера

interface LazyVideoPlayerProps {
    src: string;
    poster?: string;
    className?: string;
}

const LazyVideoPlayer: React.FC<LazyVideoPlayerProps> = ({ src, poster, className = '' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleImageClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            setShowVideo(true);
            setIsLoading(false);
        }, 300); // Небольшая имитация загрузки для плавности
    };

    return (
        <div className={`lazy-video-container ${className}`}>
            {!showVideo ? (
                <div className="video-poster" onClick={handleImageClick} aria-label="Play video">
                    <img ref={imgRef} src={poster} alt="Video preview" />
                    <div className={`play-button ${isLoading ? 'loading' : ''}`}>
                        <svg
                            className="play-icon"
                            width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="21" cy="21" r="21" fill="white" />
                            <path d="M16 12L30 21L16 30V12Z" fill="#1a1a1a" />
                        </svg>
                    </div>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    className="lazy-video"
                    controls
                    autoPlay
                    poster={poster}
                >
                    <source src={src} type="video/mp4" />
                    Ваш браузер не поддерживает видео.
                </video>
            )}
        </div>
    );
};

export default LazyVideoPlayer;