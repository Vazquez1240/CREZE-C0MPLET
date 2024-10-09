import { Link } from "react-router-dom";
import React from "react";
import { ComponenteError } from "../../interfaces/login.ts";
import useUserData from "../../stores/userData.ts";

interface BotonProps {
    mensaje: string;
    url_redireccion: string;
    onClick?: () => void;
}

interface Props {
    componente: ComponenteError & { botones: BotonProps[] };
}

export default function ErrorComponente({ componente }: Props) {
    const { numero_error, mensaje, url_redireccion, botones } = componente;

    return (
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8" style={{background:'#f4f3ee'}}>
            <div className="text-center">
                <p className="text-7xl font-semibold text-indigo-600">{numero_error} :(</p>
                <p className="mt-6 text-base leading-7 text-gray-600">{mensaje}</p>
                <div className="flex flex-row items-center justify-center gap-6">
                    {
                        botones.map((boton, index) => (
                            <div key={index} className="mt-4 flex items-center justify-center gap-x-6">
                                <Link
                                    to={boton.url_redireccion}
                                    onClick={() => {
                                        // @ts-ignore
                                        boton.mensaje.toLowerCase() === 'ir al inicio' ? useUserData.clearDataUser() : boton.onClick()
                                    }}
                                    className="rounded-md px-3.5 py-2.5 text-sm font-semibold
                                        text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                                        focus-visible:outline-indigo-600"
                                    style={{background: '#415A77'}}
                                >
                                    {boton.mensaje}
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        </main>
    );
}
