import React from 'react';
import { useApp } from '../../context/AppContext';
import Login from './Login';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean; // Добавляем опциональный параметр
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAdmin = false
}) => {
    const { state } = useApp();

    // Если пользователь не аутентифицирован
    if (!state.isAuthenticated) {
        return <Login />;
    }

    // Если требуется админ, но пользователь не админ
    if (requireAdmin && !state.isAdmin) {
        return (
            <div className="access-denied">
                <h2>Доступ запрещен</h2>
                <p>У вас нет прав для доступа к этой странице.</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;