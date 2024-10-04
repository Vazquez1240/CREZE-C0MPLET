import React, { useState, useEffect } from "react";
import { Documento } from "../../interfaces/login.ts";
import { HistorialDocumentos } from "../../api/api.ts";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import NotFoundDocument from "../Error/NotFoundDocument.tsx";
import Typography from '@mui/material/Typography';
// @ts-ignore
import BookLoader from "../../utils/Loading/bookloader.js";
import '../../assets/stylesheet/UpdateDocument.css';
import {Download} from "@mui/icons-material";
import {Button} from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Delete} from "@mui/icons-material";
import {Visibility} from "@mui/icons-material";

export default function UpdateDocument() {
    const [documents, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fade, setFade] = useState(false);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);


    const handleDownload = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name; // Aquí puedes establecer el nombre con el que quieres que se descargue
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const fetchDocumentos = async () => {
            const response = await HistorialDocumentos();
            if (response.status === 200 && response.data.length > 0) {
                setDocumentos(response.data);
            } else {
                setDocumentos(response.data);
            }
            setTimeout(() => {
                setLoading(false);
                setFade(true)
            }, 500);
        };

        fetchDocumentos();
    }, []);

    useEffect(() => {
        if (!loading && fade) {
            setTimeout(() => {
                setIsLoadingComplete(true);
            }, 500);
        }
    }, [loading, fade]);

    return (
        <div className='flex flex-col justify-center items-center'>
            {loading ? (
                <div className={`fade ${fade ? 'show' : ''} w-full flex justify-center py-24`}
                     style={{opacity: isLoadingComplete ? 0 : 1, transition: 'opacity 0.5s ease-in-out'}}>

                    <BookLoader text='Cargando...' desktopSize='70px' />

                </div>
            ) : (
                <div className='flex flex-col gap-3 w-[70%]'>
                    <div className='flex flex-col justify-center '>
                        <Typography textAlign={'justify'}>
                            ¡Bienvenido a tu espacio personal! Aquí podrás encontrar todos los archivos que se
                            han subido, organizados de manera clara y accesible para que puedas consultarlos en
                            cualquier momento. Este espacio ha sido diseñado pensando en ti, para facilitar la
                            visualización y el acceso a todos los documentos que necesitas. Ya no tendrás que
                            preocuparte por perder información o por buscar entre múltiples plataformas, todo
                            lo que se ha compartido estará reunido aquí.
                        </Typography>
                    </div>
                    {documents.length > 0 ? (
                        <Card style={{background:'#f4f3ee'}}>
                            <CardContent>
                                {
                                    documents.map((documento: Documento, index) => (
                                        <ListItem key={index} component="div"  style={{background:'#f4f3ee'}}>
                                            <ListItemButton>
                                                <ListItemText primary={documento.name_document}/>
                                                <Button
                                                    endIcon={<Download color={'info'}/>}
                                                    onClick={() => handleDownload(documento.url_document, documento.name_document)}/>
                                                <Button
                                                endIcon={<Delete color={'warning'}/>}/>
                                            </ListItemButton>
                                        </ListItem>

                                    ))
                                }
                            </CardContent>
                        </Card>
                    ) : (
                        <NotFoundDocument/>
                    )}
                </div>
            )}
        </div>
    )
}
