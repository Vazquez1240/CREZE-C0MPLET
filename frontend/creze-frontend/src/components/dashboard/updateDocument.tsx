import React, { useState, useEffect } from "react";
import { Documento } from "../../interfaces/login.ts";
import { HistorialDocumentos } from "../../api/api.ts";
import NotFoundDocument from "../Error/NotFoundDocument.tsx";
import Typography from '@mui/material/Typography';
// @ts-ignore
import SunspotLoader from "../../utils/Loading/sunspotloader.js";
import '../../assets/stylesheet/UpdateDocument.css';
import {ArrowBack, ArrowForward, Download} from "@mui/icons-material";
import {Button, DialogActions, PaginationItem} from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {CardHeader} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {EliminarDocumento} from "../../api/api.ts";
import { Backdrop, CircularProgress } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import {CardActions} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Dialog from "@mui/material/Dialog";

export default function UpdateDocument() {
    const [documents, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fade, setFade] = useState(false);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);
    const [showLoading, setShowLoading] = useState(false)
    const [numberPagination, setNumberPagination] = useState<number>(1);
    const [actualPagina, setActualPagina] = useState<number>(1);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [idDocument, setIdDocument] = useState<number>(0);


    const handleDownload = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name; // Aquí puedes establecer el nombre con el que quieres que se descargue
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const DeleteDocument = async () => {
        setShowDeleteDialog(true)
    }

    const confirmDelete = async () => {
        setShowDeleteDialog(false)
        setShowLoading(true)
        const response = await EliminarDocumento(idDocument)
        // @ts-ignore
        if(response.status === 204){
            setDocumentos(documents.filter((document:Documento) => document.id !== idDocument))
            setShowLoading(false);
            if(documents.length === 1 && actualPagina !== 1){
                setActualPagina(actualPagina - 1)
            }

        }
    }

    useEffect(() => {
        const fetchDocumentos = async () => {
            setLoading(true)
            try{
                const response = await HistorialDocumentos(actualPagina);
                if (response.status === 200 && response.data.results.length > 0) {
                    const paginas = paginationNumber(response.data.count)
                    setNumberPagination(paginas)
                    setDocumentos(response.data.results);
                } else {
                    setDocumentos(response.data.results);
                }
                setTimeout(() => {
                    setLoading(false);
                    setFade(true)
                }, 500);
            }catch(error) {
                console.log(error)
            }
        };

        fetchDocumentos();
    }, [actualPagina]);

    useEffect(() => {
        if (!loading && fade) {
            setTimeout(() => {
                setIsLoadingComplete(true);
            }, 500);
        }
    }, [loading, fade]);

    const paginationNumber = (countPages:number) => {
        return Math.ceil(countPages / 10);
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setActualPagina(page); // Actualiza la página actual
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            {loading ? (
                <div className={`fade ${fade ? 'show' : ''} w-full flex justify-center py-24`}
                     style={{opacity: isLoadingComplete ? 0 : 1, transition: 'opacity 0.5s ease-in-out'}}>

                    <SunspotLoader
                        gradientColors={["#415A77", "#778DA9"]}
                        desktopSize={"90px"}
                        mobileSize={"100px"}/>

                </div>
            ) : (
                <div className='flex flex-col gap-3 w-[70%] mx-auto'>
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
                            <div style={{background: '#f4f3ee'}} className='flex flex-col gap-5'>
                                <Backdrop
                                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                                    open={showLoading} >
                                    <CircularProgress color="inherit" />
                                </Backdrop>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    <Dialog
                                        open={showDeleteDialog}>
                                        <DialogTitle>
                                            ¿Estás seguro de que quieres eliminar este archivo?
                                        </DialogTitle>
                                        <DialogContent>
                                            <DialogContentText color={'dimgray'}>
                                                Esta acción no se puede deshacer. El archivo será eliminado permanentemente.
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>

                                            <Button
                                                onClick={() => setShowDeleteDialog(false)}
                                                color='info'>
                                                Cancelar
                                            </Button>

                                            <Button autoFocus color="error"
                                                onClick={() => confirmDelete()}>
                                                Eliminar
                                            </Button>

                                        </DialogActions>
                                    </Dialog>
                                    {
                                        documents.map((documento: Documento, index) => (
                                            <Card key={index} style={{background: '#f4f3ee'}}>
                                                <CardContent className='flex flex-col justify-around h-full '>
                                                    <CardHeader title={
                                                        <Typography variant="h6" sx={{ fontSize: '14px' }}>
                                                            {documento.name_document}
                                                        </Typography>
                                                    } />
                                                    <CardContent className='flex flex-col gap-4'>
                                                        <Typography variant='caption'>
                                                            <b>Subido:</b> {new Date(documento.uploaded_at).getUTCDate()} /
                                                            {new Date(documento.uploaded_at).getUTCMonth() + 1} /
                                                            {new Date(documento.uploaded_at).getUTCFullYear()}
                                                        </Typography>
                                                        <Typography variant='caption'><b>Tamaño:</b> {parseInt(documento.original_size) / 100} Mb</Typography>
                                                    </CardContent>
                                                    <CardActions className='flex flex-row gap-6'>
                                                        <Button
                                                            color={'info'}
                                                            size={'small'}
                                                            startIcon={<Download />}
                                                            onClick={() => handleDownload(documento.url_document, documento.name_document)}>
                                                            Descargar
                                                        </Button>
                                                        <IconButton
                                                            aria-label="delete"
                                                            color={'warning'}
                                                            onClick={() => {
                                                                setIdDocument(documento.id)
                                                                DeleteDocument()
                                                            }}>
                                                            <Delete />
                                                        </IconButton>
                                                    </CardActions>
                                                </CardContent>
                                            </Card>

                                        ))
                                    }
                                </div>

                                <div className='flex justify-center w-full'>
                                    <Pagination
                                    count={numberPagination}
                                    page={actualPagina}
                                    onChange={handlePageChange}
                                    shape="rounded"
                                    renderItem={(item) => (
                                        <PaginationItem
                                            slots={{ previous: ArrowBack, next: ArrowForward }}
                                            {...item}
                                        />
                                    )}/>
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
