import React from "react";
import { Outlet } from 'react-router-dom';

export default function Dashboard() {


    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 min-h-full justify-center">
            <Outlet />
        </div>
    )
}
