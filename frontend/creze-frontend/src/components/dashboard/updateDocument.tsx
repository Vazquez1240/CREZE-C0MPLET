import React, { useState, useEffect } from "react";
import { Documento } from "../../interfaces/login.ts";
import { HistorialDocumentos } from "../../api/api.ts";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import NotFoundDocument from "../Error/NotFoundDocument.tsx";
import CardContent from "@mui/material/CardContent";
import Card from '@mui/material/Card';
// @ts-ignore
import BookLoader from "../../utils/Loading/bookloader.js";
import '../../assets/stylesheet/UpdateDocument.css';
import {Download} from "@mui/icons-material";
import {Button} from "@mui/material";

export default function UpdateDocument() {
    const [documents, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fade, setFade] = useState(false);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);

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
        <div style={{height: '100%'}}>
            {loading ? (
                <div className={`fade ${fade ? 'show' : ''} w-full flex justify-center py-24`}
                     style={{opacity: isLoadingComplete ? 0 : 1, transition: 'opacity 0.5s ease-in-out'}}>

                    <BookLoader text='Cargando...' desktopSize='70px' />

                </div>
            ) : (
                <div>
                    {documents.length > 0 ? (
                        documents.map((documento: Documento, index) => (
                            <Card>
                                <CardContent>
                                    <ListItem key={index} component="div" disablePadding>
                                        <ListItemButton>
                                            <ListItemText primary={documento.name_document}/>
                                            <Button endIcon={<Download color={'secondary'}/>} />
                                        </ListItemButton>
                                    </ListItem>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <NotFoundDocument/>
                    )}
                </div>
            )}
        </div>
    )
}
