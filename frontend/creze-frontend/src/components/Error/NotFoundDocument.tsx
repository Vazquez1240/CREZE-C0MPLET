import React from "react";
import { Link } from "react-router-dom";



export default function NotFoundDocument() {
    return (
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8" style={{background:'#f4f3ee'}}>
            <div className="text-center">
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-1xl">Upssss.. :(</h1>
                <p className="mt-6 text-base leading-7 text-gray-600">
                    Lo sentimos, parece que todavía no se han cargado archivos. Sube uno e intenta nuevamente.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to={'/inicio'}
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Ir a inicio
                    </Link>
                </div>
            </div>
        </main>
    )
}
