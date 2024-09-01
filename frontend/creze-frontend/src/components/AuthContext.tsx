import React, { createContext, useContext, useState, useEffect } from "react";
import useUserData from "../stores/userData.ts";

const AuthContext = createContext(null);

// @ts-ignore
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(useUserData.isAuthenticated);

    useEffect(() => {
        const checkAuth = async () => {
            const response = await useUserData.checkAuthentication();
            setIsAuthenticated(response.status === 200);
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
