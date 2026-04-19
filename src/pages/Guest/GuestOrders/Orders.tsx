// src/pages/guest/orders/Orders.tsx
import React, { useState } from 'react';

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    date: string;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items: OrderItem[];
}

// Моковые данные (замените на реальные из API)
const mockOrders: Order[] = [
    {
        id: 1001,
        date: '2025-03-20',
        status: 'processing',
        total: 2450.00,
        items: [
            { id: 1, name: 'Фигурка 3д', price: 2200.00, quantity: 1 },
            { id: 2, name: 'Фигурка 3д', price: 250.00, quantity: 1 }
        ]
    },
    {
        id: 1002,
        date: '2025-03-15',
        status: 'shipped',
        total: 899.00,
        items: [
            { id: 3, name: 'Фигурка 3д', price: 899.00, quantity: 1 }
        ]
    },
    {
        id: 1003,
        date: '2025-03-10',
        status: 'delivered',
        total: 3450.00,
        items: [
            { id: 4, name: 'Фигурка 3д"', price: 2450.00, quantity: 1 },
            { id: 5, name: 'Фигурка 3д', price: 500.00, quantity: 2 }
        ]
    },
    {
        id: 1004,
        date: '2025-03-05',
        status: 'cancelled',
        total: 1200.00,
        items: [
            { id: 6, name: 'Фигурка 3д', price: 1200.00, quantity: 1 }
        ]
    }
];

const statusLabels: Record<Order['status'], string> = {
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменён'
};

const statusColors: Record<Order['status'], string> = {
    processing: '#ff9800',
    shipped: '#2196f3',
    delivered: '#4caf50',
    cancelled: '#f44336'
};

const Orders: React.FC = () => {
    const [orders] = useState<Order[]>(mockOrders);
    const [filter, setFilter] = useState<Order['status'] | 'all'>('all');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    const toggleDetails = (id: number) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
    };

    // Inline styles for the glass effect (using CSS variables from App.css)
    const glassCardStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
    };

    const glassContainerStyle: React.CSSProperties = {
        minHeight: '100vh',
        padding: '2rem 0',
        background: 'var(--background)',
    };

    const filterButtonStyle = (isActive: boolean): React.CSSProperties => ({
        background: isActive ? 'var(--primary, #3e85a5)' : 'rgba(128, 128, 128, 0.1)',
        border: '1px solid rgba(128, 128, 128, 0.2)',
        borderRadius: '2rem',
        padding: '0.5rem 1.25rem',
        fontSize: '0.9rem',
        fontWeight: 500,
        color: isActive ? 'white' : 'var(--text-primary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    });

    return (
        <div style={glassContainerStyle}>
            <div className="container">
                <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}>
                    Мои заказы
                </h1>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        style={filterButtonStyle(filter === 'all')}
                        onClick={() => setFilter('all')}
                    >
                        Все
                    </button>
                    <button
                        style={filterButtonStyle(filter === 'processing')}
                        onClick={() => setFilter('processing')}
                    >
                        В обработке
                    </button>
                    <button
                        style={filterButtonStyle(filter === 'shipped')}
                        onClick={() => setFilter('shipped')}
                    >
                        Отправлен
                    </button>
                    <button
                        style={filterButtonStyle(filter === 'delivered')}
                        onClick={() => setFilter('delivered')}
                    >
                        Доставлен
                    </button>
                    <button
                        style={filterButtonStyle(filter === 'cancelled')}
                        onClick={() => setFilter('cancelled')}
                    >
                        Отменён
                    </button>
                </div>

                {filteredOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderRadius: '12px', maxWidth: '600px', margin: '0 auto' }}>
                        <p>У вас нет заказов с выбранным статусом.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                        {filteredOrders.map(order => (
                            <div key={order.id} style={{ ...glassCardStyle, overflow: 'hidden' }}>
                                <div
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', cursor: 'pointer', gap: '1rem', flexWrap: 'wrap' }}
                                    onClick={() => toggleDetails(order.id)}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '120px' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Заказ №{order.id}</span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{formatDate(order.date)}</span>
                                    </div>
                                    <div style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 500, color: 'white', backgroundColor: statusColors[order.status] }}>
                                        {statusLabels[order.status]}
                                    </div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                                        {formatPrice(order.total)}
                                    </div>
                                    <div style={{ width: '24px', height: '24px', position: 'relative', transition: 'transform 0.3s ease', transform: expandedId === order.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '12px', height: '2px', background: 'var(--text-secondary)', transform: 'translate(-50%, -50%)' }} />
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '12px', height: '2px', background: 'var(--text-secondary)', transform: 'translate(-50%, -50%) rotate(90deg)' }} />
                                    </div>
                                </div>
                                {expandedId === order.id && (
                                    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.02)' }}>
                                        <div>
                                            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1rem' }}>Товары в заказе:</h4>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Товар</th>
                                                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Цена</th>
                                                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Кол-во</th>
                                                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Сумма</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.items.map(item => (
                                                        <tr key={item.id}>
                                                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)' }}>{item.name}</td>
                                                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)' }}>{formatPrice(item.price)}</td>
                                                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)' }}>{item.quantity}</td>
                                                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)' }}>{formatPrice(item.price * item.quantity)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;