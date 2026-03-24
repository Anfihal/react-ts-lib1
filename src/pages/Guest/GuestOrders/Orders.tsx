// src/pages/guest/orders/Orders.tsx
// src/pages/guest/orders/Orders.tsx
import React, { useState } from 'react';
import './Orders.css';

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

    return (
        <div className="orders-page">
            <div className="container">
                <h1 className="orders-title">Мои заказы</h1>

                <div className="orders-filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Все
                    </button>
                    <button
                        className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
                        onClick={() => setFilter('processing')}
                    >
                        В обработке
                    </button>
                    <button
                        className={`filter-btn ${filter === 'shipped' ? 'active' : ''}`}
                        onClick={() => setFilter('shipped')}
                    >
                        Отправлен
                    </button>
                    <button
                        className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
                        onClick={() => setFilter('delivered')}
                    >
                        Доставлен
                    </button>
                    <button
                        className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setFilter('cancelled')}
                    >
                        Отменён
                    </button>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="orders-empty">
                        <p>У вас нет заказов с выбранным статусом.</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {filteredOrders.map(order => (
                            <div key={order.id} className={`order-card ${expandedId === order.id ? 'expanded' : ''}`}>
                                <div className="order-header" onClick={() => toggleDetails(order.id)}>
                                    <div className="order-info">
                                        <span className="order-id">Заказ №{order.id}</span>
                                        <span className="order-date">{formatDate(order.date)}</span>
                                    </div>
                                    <div className="order-status" style={{ backgroundColor: statusColors[order.status] }}>
                                        {statusLabels[order.status]}
                                    </div>
                                    <div className="order-total">{formatPrice(order.total)}</div>
                                    <div className={`order-expand-icon ${expandedId === order.id ? 'open' : ''}`}></div>
                                </div>
                                {expandedId === order.id && (
                                    <div className="order-details">
                                        <div className="order-items">
                                            <h4>Товары в заказе:</h4>
                                            <table className="items-table">
                                                <thead>
                                                    <tr>
                                                        <th>Товар</th>
                                                        <th>Цена</th>
                                                        <th>Кол-во</th>
                                                        <th>Сумма</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.items.map(item => (
                                                        <tr key={item.id}>
                                                            <td>{item.name}</td>
                                                            <td>{formatPrice(item.price)}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{formatPrice(item.price * item.quantity)}</td>
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