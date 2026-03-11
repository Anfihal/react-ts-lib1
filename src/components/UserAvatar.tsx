// components/UserAvatar.tsx
import React, { useState } from 'react';

interface UserAvatarProps {
    name?: string;
    avatar?: string; // может быть undefined, null или путь
    className?: string;
    online?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
    name,
    avatar,
    className = '',
    online = false,
}) => {
    const [imageError, setImageError] = useState(false);

    // Определяем, есть ли реальное фото (не заглушка)
    const isDefaultAvatar = (path?: string) => {
        if (!path) return true;
        return (
            path.includes('user-avatar.png') ||
            path.includes('admin-avatar.png') ||
            path.startsWith('data:') === false && !path.startsWith('http')
        );
    };

    const hasValidAvatar = avatar && !isDefaultAvatar(avatar) && !imageError;

    // Определяем букву
    let fallbackLetter = 'U';
    if (name) {
        fallbackLetter = name.charAt(0).toUpperCase();
    } else if (avatar?.includes('admin')) {
        fallbackLetter = 'A'; // на случай, если у админа нет имени
    } else if (!name && !avatar) {
        fallbackLetter = 'G'; // Guest
    }

    return (
        <div
            className={`user-avatar ${online ? 'online' : ''} ${className}`}
            aria-label={name || 'User'}
        >
            {hasValidAvatar && (
                <img
                    src={avatar}
                    alt=""
                    className="avatar-image"
                    onError={() => setImageError(true)}
                />
            )}
            <span className={`fallback ${hasValidAvatar ? 'hidden' : ''}`}>
                {fallbackLetter}
            </span>
        </div>
    );
};

export default UserAvatar;