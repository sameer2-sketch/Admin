import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            let payload = {
                idToken: user?.user?.stsTokenManager?.accessToken,
                refreshToken: user?.user?.stsTokenManager?.refreshToken
            }
            const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error('Something went wrong. Please try again later');
            } else {
                const { password: _, ...userWithoutPassword } = data?.userInfo;
                setUser(userWithoutPassword);
                localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            }
        } catch (error) {
            throw new Error('Invalid email or password');
        } finally {
            setIsLoading(false);
        }

    };

    const handleSignUpErrors = (errors) => {
        switch (errors?.code) {
            case 'auth/email-already-in-use':
                throw new Error('Account already exists. Try again with different Email.');
            case 'auth/missing-password':
                throw new Error('Please enter valid email or password!!');
            case 'auth/invalid-email':
                throw new Error('Please enter valid email!!');
            default:
                throw new Error('Please enter valid email or password!!');
        }
    }

    const signup = async (name, email, phone, password) => {
        try {
            if (!name.trim()) {
                throw new Error('Name is required');
            }
            if (!email.trim()) {
                throw new Error('Email is required');
            }
            if (!/\S+@\S+\.\S+/.test(email)) {
                throw new Error('Please enter a valid email address');
            }
            if (!phone.trim()) {
                throw new Error('Phone number is required');
            }
            if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
                throw new Error('Please enter a valid phone number');
            }
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }
            setIsLoading(true);
            const user = await createUserWithEmailAndPassword(auth, email, password);
            let payload = {
                name: name,
                phoneNumber: phone,
                password: password,
                email: email,
                idToken: user?.user?.stsTokenManager?.accessToken,
                refreshToken: user?.user?.stsTokenManager?.refreshToken,
            }
            const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error('Something went wrong. Please try again later');
            } else {
                const { password: _, ...userWithoutPassword } = data?.userInfo;
                setUser(userWithoutPassword);
                localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            }
        } catch (error) {
            const errString = JSON.stringify(error);
            const errorJson = JSON.parse(errString);
            handleSignUpErrors(errorJson)
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            signup,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};