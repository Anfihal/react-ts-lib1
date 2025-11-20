// src/components/RedirectHandler.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Редирект на главную при загрузке
        navigate('/home', { replace: true });
    }, [navigate]);

    return (
        <div className="loading">
            Перенаправление на главную страницу...
        </div>
    );
};

export default RedirectHandler;