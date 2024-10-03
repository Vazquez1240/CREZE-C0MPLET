import React from "react";
import { Outlet } from 'react-router-dom';

export default function Dashboard() {


    return (
        <main className='min-h-full'>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 bg-white shadow min-h-full">
                <Outlet />
            </div>
        </main>
    )
}
