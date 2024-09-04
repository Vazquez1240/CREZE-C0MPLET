import React from "react";
import { useLocation } from 'react-router-dom';
import UpdateDocument from "./updateDocument.tsx";

export default function Dashboard() {

    const location = useLocation();

    return (
        <>
            <div className="min-h-full">
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {
                            location.pathname === '/home#' ? (<UpdateDocument />) : (<p>adios</p>)
                        }
                    </div>
                </main>
            </div>
        </>
    )
}
