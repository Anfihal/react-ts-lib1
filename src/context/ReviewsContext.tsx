import React, { createContext, useState, useContext } from 'react';

export interface Review {
    id: string;
    name: string;
    email?: string;
    rating: number;
    text: string;
    status: 'pending' | 'published' | 'hidden';
    createdAt: string;
    verified?: boolean;
    new?: boolean;
}

interface ReviewsContextType {
    reviews: Review[];
    addReview: (review: Omit<Review, 'id' | 'status' | 'createdAt' | 'new'>) => void;
    updateReview: (id: string, updates: Partial<Review>) => void;
    deleteReview: (id: string) => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: '1',
            name: "Alex Chen",
            email: "alex@fintech.io",
            rating: 5,
            text: "Their cloud migration service reduced our AWS costs by 40% while improving system reliability. Highly recommended!",
            status: "published",
            createdAt: "2023-10-15T10:00:00Z",
            verified: true,
            new: false
        },
        {
            id: '2',
            name: "Sophie Martinez",
            email: "sophie@scaleup.ai",
            rating: 5,
            text: "Scaled our platform to 1M+ users in under 6 months with zero downtime. Their engineering team is exceptional.",
            status: "pending",
            createdAt: "2023-11-02T14:30:00Z",
            verified: true,
            new: true
        }
    ]);

    const addReview = (reviewData: Omit<Review, 'id' | 'status' | 'createdAt' | 'new'>) => {
        const newReview: Review = {
            ...reviewData,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending',
            createdAt: new Date().toISOString(),
            verified: !!reviewData.email,
            new: true
        };
        setReviews([...reviews, newReview]);

        setTimeout(() => {
            setReviews(prev => prev.map(r =>
                r.id === newReview.id ? { ...r, new: false } : r
            ));
        }, 10000);
    };

    const updateReview = (id: string, updates: Partial<Review>) => {
        setReviews(reviews.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const deleteReview = (id: string) => {
        setReviews(reviews.filter(r => r.id !== id));
    };

    return (
        <ReviewsContext.Provider value={{ reviews, addReview, updateReview, deleteReview }}>
            {children}
        </ReviewsContext.Provider>
    );
};

export const useReviews = () => {
    const context = useContext(ReviewsContext);
    if (!context) {
        throw new Error('useReviews must be used within a ReviewsProvider');
    }
    return context;
};