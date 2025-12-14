'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    user_id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Mock user for development
    const [user] = useState<User | null>({ user_id: 'mock-user-123', email: 'user@example.com' });

    const refreshUser = async () => { console.log('refreshUser called'); };

    return (
        <AuthContext.Provider value={{ user, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        return { user: { user_id: 'mock-fallback', email: 'mock@fallback.com' }, refreshUser: async () => { } };
    }
    return context;
};
