import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import {SucessResponse} from "../interfaces/login.ts";
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import {CheckCircle} from "@mui/icons-material";

interface Props {
    dialogo: SucessResponse
}

const SuccesRegister = ({ dialogo }: Props) => {
    const {titulo, openDialog, message} = dialogo;
    return (
        <Dialog open={openDialog} style={{display: 'flex', justifyContent: 'center', padding: '2em'}}>
            <DialogTitle style={{display: 'flex', justifyContent:'center'}}>
                <CheckCircle color={'success'}  sx={{ fontSize: 80 }}/>
            </DialogTitle>
            <DialogContent className='flex flex-col gap-2'>
                <DialogContentText style={{color: 'black'}}>
                    {message}
                </DialogContentText>
                <DialogContent className='flex justify-end gap-3'>
                    <Button className='transfo'>
                        <Link to={'/'}>Iniciar sesión</Link>
                    </Button>
                    <Button>
                        Cerrar
                    </Button>
                </DialogContent>
            </DialogContent>
        </Dialog>
    )
}

export default SuccesRegister;
