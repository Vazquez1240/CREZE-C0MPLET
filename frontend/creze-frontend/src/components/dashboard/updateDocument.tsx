import React, {useState, useEffect} from "react";
import {Documento} from "../../interfaces/login.ts";
import {HistorialDocumentos} from "../../api/api.ts";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import NotFoundDocument from "../Error/NotFoundDocument.tsx";


export default function UpdateDocument() {
    /*const location = useLocation();
    console.log(location.pathname, 'name');*/
    const [documentos, setDocumentos] = useState([]);

    const response = HistorialDocumentos()

    useEffect(() => {
        const fetchDocumentos = async () => {
            const response = await HistorialDocumentos();
            console.log(response, 'deee');
            setDocumentos(response);
        };

        fetchDocumentos();
    }, []); // Ejecutar solo una vez al montar el componente

    return(
        <div style={{height: '100%'}}>
            {
                documentos.length > 0 ?

                    (
                        documentos.map((documento:Documento, index) => {
                            return (
                                <div key={index}>
                                    <ListItem key={index} component="div" disablePadding>
                                        <ListItemButton>
                                            <ListItemText primary={documento.name_document} />
                                        </ListItemButton>
                                    </ListItem>
                                </div>
                            )
                        })
                    )
                    :
                    (
                        <>
                            <NotFoundDocument />
                        </>
                    )
            }
        </div>
    )
}
