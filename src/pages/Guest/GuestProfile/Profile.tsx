// src/pages/guest/profile/Profile.tsx
import React from 'react';
import './Profile.css';

const Profile: React.FC = () => {
    return (
        <div className="profile-page">
            <div className="container">
                <h1>👤 Профиль</h1>
                <p>Страница профиля в разработке</p>
                <div className="profile-placeholder">
                    <p>Здесь будет информация о профиле пользователя</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;