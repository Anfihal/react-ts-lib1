// src/pages/Admin/Admin.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../../components/admin/Dashboard/Dashboard';
import ContactManagement from '../../components/admin/contact/ContactManagement';
import ServiceManagement from '../../components/admin/services/ServiceManagement';
import ProductManagement from '../../components/admin/products/ProductManagement';
import AboutManagement from '../../components/admin/about/AboutManagement';
import HomeManagement from '../../components/admin/home/HomeManagement';
import AdminChatPage from './AdminChatPage';
import SystemStats from '../../components/admin/Stats/SystemStats';
import UserManagement from '../../components/admin/users/UserManagement'; // ← новый импорт
import AdminReviews from './AdminReviews/AdminReviews';
import './Admin.css';

const Admin: React.FC = () => {
    return (
        <div className="admin-page">
            <div className="admin-content">
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="home" element={<HomeManagement />} />
                    <Route path="chat" element={<AdminChatPage />} />
                    <Route path="stats" element={<SystemStats />} />
                    <Route path="services" element={<ServiceManagement />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="about" element={<AboutManagement />} />
                    <Route path="users" element={<UserManagement />} /> {/* ← замена */}
                    <Route path="contact" element={<ContactManagement />} />
                    <Route path="reviews" element={<AdminReviews />} />
                </Routes>
            </div>
        </div>
    );
};

export default Admin;