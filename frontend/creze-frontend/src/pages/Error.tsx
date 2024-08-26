import React from 'react';
import ErrorComponente from "../components/Error/ErrorComponente.tsx";
import {errorUnauthorized, errorRefreshToken} from "../utils/Messages.ts";

export default function ErrorPage() {
    return (
        <>
            <ErrorComponente componente={localStorage.getItem('access_token') ? errorRefreshToken : errorUnauthorized} />
        </>
    )
}
