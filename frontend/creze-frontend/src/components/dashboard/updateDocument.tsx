import React from "react";
import { useLocation } from 'react-router-dom';

export default function UpdateDocument() {
    const location = useLocation();
    console.log(location.pathname, 'name');
    return(
        <>
            <h2>
                3333
            </h2>
        </>
    )
}
