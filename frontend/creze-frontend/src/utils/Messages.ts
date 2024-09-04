import RefreshTokenFunction from "./FunctionsBottons.ts";

export const errorUnauthorized = {
    numero_error: 'Error 403',
    mensaje: 'Lo sentimos, usted no tiene permisos para estar en esta sección.',
    url_redireccion: '/',
    botones: [
        {
            mensaje: 'Ir al inicio',
            url_redireccion: '/',
        }
    ]
}


export const errorRefreshToken = {
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
                url_redireccion: '/inicio',
                onClick: () => RefreshTokenFunction()
            }
        ]
    }
