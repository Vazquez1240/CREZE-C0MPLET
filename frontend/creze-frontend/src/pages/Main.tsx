import React from 'react';
import { observer } from 'mobx-react-lite';
import useUserData from "../stores/userData.ts";
import {Link} from "react-router-dom";

const MainPage = observer(() => {
    const access_token = localStorage.getItem("access_token");

    if (!access_token) {
        return (
            <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-7xl font-semibold text-indigo-600">Error 403 :(</p>
                    <p className="mt-6 text-base leading-7 text-gray-600">Lo sentimos, usted no tiene permisos para estar en esta sección.</p>
                    <div className="mt-4 flex items-center justify-center gap-x-6">
                        <Link to={'/'}
                           className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold
                           text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                           focus-visible:outline-indigo-600">Ir a inicio</Link>
                    </div>
                </div>
            </main>

        )
    }
    return (
        <div>
            <p>Access Token: {useUserData.access_token}</p>
            <p>Refresh Token: {useUserData.refresh_token}</p>
        </div>
    );
});

export default MainPage;
