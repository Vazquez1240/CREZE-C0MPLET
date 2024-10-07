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
import {EliminarDocumento} from "../../api/api.ts";
import { Backdrop, CircularProgress } from '@mui/material';

export default function UpdateDocument() {
    const [documents, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fade, setFade] = useState(false);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);
    const [showLoading, setShowLoading] = useState(false)


    const handleDownload = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name; // Aquí puedes establecer el nombre con el que quieres que se descargue
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const DeleteDocument = async (idDocument:number) => {
        setShowLoading(true)
        const response = await  EliminarDocumento(idDocument)
        // @ts-ignore
        if(response.status === 204){
            setDocumentos(documents.filter((document:Documento) => document.id !== idDocument))
            setShowLoading(false);
        }
    }

    useEffect(() => {
        const fetchDocumentos = async () => {
            const response = await HistorialDocumentos();
            if (response.status === 200 && response.data.results.length > 0) {
                setDocumentos(response.data.results);
            } else {
                setDocumentos(response.data.results);
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
                    {documents.length > 0 ? (
                        <div className='flex flex-col gap-4'>
                            <Typography textAlign={'justify'}>
                                    ¡Bienvenido a tu espacio personal! Aquí podrás encontrar todos los archivos que se
                                    han subido, organizados de manera clara y accesible para que puedas consultarlos en
                                    cualquier momento. Este espacio ha sido diseñado pensando en ti, para facilitar la
                                    visualización y el acceso a todos los documentos que necesitas. Ya no tendrás que
                                    preocuparte por perder información o por buscar entre múltiples plataformas, todo
                                    lo que se ha compartido estará reunido aquí.
                                </Typography>
                            <div style={{background: '#f4f3ee'}}>
                            <Backdrop
                                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                                open={showLoading}
                            >
                            <CircularProgress color="inherit" />
                          </Backdrop>
                            <div className='flex flex-row gap-5 '>
                                {
                                    documents.map((documento: Documento, index) => (
                                        <Card className='w-52 h-26' key={index} style={{background: '#f4f3ee'}}>
                                            <CardContent className='flex flex-col justify-around h-full '>
                                                <div>
                                                    <p style={{fontSize: '14px'}} className='font-sans'>{documento.name_document}</p>
                                                </div>
                                                <div>
                                                    <Button
                                                    endIcon={<Download color={'info'}/>}
                                                    onClick={() => handleDownload(documento.url_document, documento.name_document)}/>
                                                <Button
                                                    endIcon={<Delete color={'warning'}/>}
                                                    onClick={() => DeleteDocument(documento.id)}/>
                                                </div>
                                            </CardContent>
                                        </Card>

                                    ))
                                }
                            </div>
                        </div>
                        </div>
                    ) : (
                        <NotFoundDocument/>
                    )}
                </div>
            )}
        </div>
    )
}
