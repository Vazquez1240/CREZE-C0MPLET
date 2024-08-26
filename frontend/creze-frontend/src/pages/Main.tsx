import React, {useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';
import Dashboard from "../components/dashboard/dashboard.tsx";
import useUserData from "../stores/userData.ts";
import {useNavigate} from "react-router-dom";



const MainPage = observer(() => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        const verifyToken = async () => {
            const valid = await useUserData.checkAuthentication();

            if (valid.status === 200) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                navigate('/error'); // Mueve la navegación aquí
            }
        };

        verifyToken();
    }, [navigate]); // Agrega navigate como dependencia

    return (
        isAuthenticated ? (
            <Dashboard />
        ) : null
    );

});

export default MainPage;
