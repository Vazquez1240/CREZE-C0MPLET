import React from 'react';
import { Button, Input } from '@mui/material';
import {FileUpload} from "@mui/icons-material";

export default function ComponenteDocumento() {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
  };

  return (
      <main>
          <header>
              En esta sección, tendrás la posibilidad de cargar tus documentos. Dispondrás de un espacio designado para
              subir los archivos que consideres necesarios. Es importante destacar que tus documentos serán transmitidos
              de manera segura a la nube. Además, podrás visualizarlos en la sección "Mis Documentos", donde encontrarás
              los archivos que has subido y tendrás la opción de eliminarlos o descargarlos según tu conveniencia.
          </header>
      </main>
  );
};
