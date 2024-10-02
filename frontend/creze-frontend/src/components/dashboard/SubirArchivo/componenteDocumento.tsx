import React, { useState } from 'react';
import { Button, TextField, IconButton, InputAdornment } from '@mui/material';
import { VisuallyHiddenInput } from '@chakra-ui/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { SubirDocumento } from "../../../api/api.ts";

export default function ComponenteDocumento() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles(prevFiles => [...prevFiles, ...fileArray]); // Almacena los archivos en el estado
      const names = fileArray.map(file => file.name);
      setFileNames(prevNames => [...prevNames, ...names]); // Actualiza los nombres de los archivos para mostrar
    }
  };

  const handleRemoveFile = (nameToRemove: string) => {
    setFileNames(prevNames => prevNames.filter(name => name !== nameToRemove)); // Elimina el archivo seleccionado
    setFiles(prevFiles => prevFiles.filter(file => file.name !== nameToRemove)); // También elimina el archivo del estado
  };

  return (
    <main className='flex flex-col gap-10 mt-10'>
      <header>
        En esta sección, tendrás la posibilidad de cargar tus documentos. Dispondrás de un espacio designado para
        subir los archivos que consideres necesarios. Es importante destacar que tus documentos serán transmitidos
        de manera segura a la nube. Además, podrás visualizarlos en la sección "Mis Documentos", donde encontrarás
        los archivos que has subido y tendrás la opción de eliminarlos o descargarlos según tu conveniencia.
      </header>

      <div>
        <TextField
          label="Seleccionar Archivos"
          value={fileNames.join(', ')} // Muestra los nombres de los archivos seleccionados
          variant="outlined"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton component="label">
                  <AttachFileIcon />
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange}
                    multiple // Permite seleccionar múltiples archivos por si se me olvida(xD)
                    style={{ display: 'none' }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div className='flex flex-col mt-2 gap-5'>
          {fileNames.map((fileName, index) => (
            <div key={index} className='flex justify-between items-center mt-4 border-b-amber-50'>
              <span>{fileName}</span>
              <Button
                variant="outlined"
                onClick={() => handleRemoveFile(fileName)}
              >
                Eliminar
              </Button>
            </div>
          ))}
        </div>
        <div className='flex flex-row gap-3 justify-end mt-5'>
          <Button
            onClick={async () => {
              try {
                const documento = await SubirDocumento(files);
                console.log(documento, 'documento');
              } catch (error) {
                console.error('Error al subir archivos:', error);
              }
            }}
            variant="contained"
          >
            Enviar archivos
          </Button>
        </div>
      </div>
    </main>
  );
};
