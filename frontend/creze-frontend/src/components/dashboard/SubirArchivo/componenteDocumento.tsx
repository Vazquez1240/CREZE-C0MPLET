import React, { useState, useEffect } from 'react';
import { Button, TextField, IconButton, InputAdornment } from '@mui/material';
import { VisuallyHiddenInput } from '@chakra-ui/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { SubirDocumento } from "../../../api/api.ts";
import useDocsStores from "../../../stores/UserDocs.ts";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { observer } from 'mobx-react-lite'; // Asegúrate de estar usando 'mobx-react-lite'

const ComponenteDocumento = observer(() => {
    const [files, setFiles] = useState(useDocsStores.files); // Estado para los archivos
    const [fileNames, setFileNames] = useState(useDocsStores.filesName); // Estado para los nombres de los archivos
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Actualizar los estados cuando los archivos o nombres cambien en el store
    useEffect(() => {
        // @ts-ignore
        setFiles([...useDocsStores.files]); // Actualizamos con una copia de los archivos
        setFileNames([...useDocsStores.filesName]); // Actualizamos con una copia de los nombres
    }, [useDocsStores.files, useDocsStores.filesName]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const fileArray = Array.from(selectedFiles); // Convertir FileList a Array
            fileArray.forEach((file) => {
                useDocsStores.setFilesUser(file); // Añadir cada archivo al store
                useDocsStores.setFilesUserName(file.name); // Añadir el nombre del archivo al store
            });

            // Actualizar los estados del componente después de agregar archivos
            // @ts-ignore
            setFiles([...useDocsStores.files]); // Actualizamos el estado de files
            setFileNames([...useDocsStores.filesName]); // Actualizamos el estado de fileNames
        }
    };

    const handleRemoveFile = (nameToRemove: string) => {
        // Eliminar el archivo del store
        useDocsStores.removeFilesUser(nameToRemove);

        // Actualizar los estados del componente después de eliminar un archivo
        // @ts-ignore
        setFiles([...useDocsStores.files]); // Forzar una nueva referencia para que React lo detecte
        setFileNames([...useDocsStores.filesName]); // Actualizar el estado de los nombres
    };


    return (
        <Card className='flex flex-col gap-10 mt-20 box-decoration-slice ' style={{background:'#f4f3ee'}}>
            <CardContent className='text-zinc-900'>
                En esta sección, tendrás la posibilidad de cargar tus documentos. Dispondrás de un espacio designado para
                subir los archivos que consideres necesarios. Es importante destacar que tus documentos serán transmitidos
                de manera segura a la nube. Además, podrás visualizarlos en la sección "Mis Documentos", donde encontrarás
                los archivos que has subido y tendrás la opción de eliminarlos o descargarlos según tu conveniencia.
            </CardContent>

            <CardContent>
                <TextField
                    label="Seleccionar Archivos"
                    className='MuiButton-colorInherit'
                    value={fileNames.join(', ')} // Muestra los nombres de los archivos seleccionados
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton component="label">
                                    <AttachFileIcon />
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={handleFileChange}
                                        multiple // Permite seleccionar múltiples archivos
                                        style={{ display: 'none' }}
                                    />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{
                        style: { color: 'black' }
                    }}
                />
                <div className='flex flex-col mt-2 gap-5'>
                    {fileNames.map((fileName, index) => (
                        <div key={index} className='flex justify-between items-center mt-4'>
                            <span>{fileName}</span>
                            <Button
                                variant="outlined"
                                color={'warning'}
                                onClick={() => handleRemoveFile(fileName)}
                            >
                                Eliminar
                            </Button>
                        </div>
                    ))}
                </div>
                <div className='flex flex-row gap-3 justify-end mt-5'>
                    <Button
                        style={{color: 'background'}}
                        onClick={async () => {
                            setIsSubmitting(true)
                            try {
                                const documento = await SubirDocumento(files);
                                if(documento.status === 201){
                                    useDocsStores.clearFilesUser()
                                    setIsSubmitting(false)
                                }
                            } catch (error) {
                                    console.error('Error al subir archivos:', error);
                            }
                        }}
                        variant="contained"
                        color={'info'}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar archivo'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
});

export default ComponenteDocumento;


