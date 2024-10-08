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
                if(valid.message === 'Access token is invalid. Please refresh your token.'){
                    setIsAuthenticated(false);
                    navigate('/error');
                }else{
                    setIsAuthenticated(false)
                    useUserData.clearDataUser()
                    navigate('/error')
                }
            }
        };

        verifyToken();
    }, [navigate]);

    return (
        <div>
            {
                isAuthenticated ? (
                    <Dashboard />
                ) : null
            }
        </div>
    );

});

export default MainPage;
