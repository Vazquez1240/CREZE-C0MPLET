import React, {useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';
import Dashboard from "../components/dashboard/dashboard.tsx";
import useUserData from "../stores/userData.ts";
import ErrorComponente from "../components/Error/ErrorComponente.tsx";
import {errorUnauthorized} from "../utils/Messages.ts";
import RefreshTokenFunction from "../utils/FunctionsBottons.ts";


const MainPage = observer(() => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const errorComponente = {
        numero_error: 'Error 401',
        mensaje: 'Lo sentimos su token ha expirado!',
        url_redireccion: '/',
        botones: [
            {
                mensaje: 'Ir al inicio',
                url_redireccion: '/',
            },
            {
                mensaje: 'Recargar la pagina',
                url_redireccion: '/home',
                onClick: () => RefreshTokenFunction()
            }
        ]
    }
    useEffect(() => {
        const verifyToken = async () => {

            const valid = await  useUserData.checkAuthentication();
            // @ts-ignore
            valid.status === 200 ? setIsAuthenticated(valid) : setIsAuthenticated(false);
        };
        verifyToken();
    }, []);

    return (
        isAuthenticated ? (
            <Dashboard />
        ) : (
            <div>
                <ErrorComponente componente={useUserData.access_token === '' ? errorUnauthorized : errorComponente} />
            </div>
        )
    );

});

export default MainPage;
