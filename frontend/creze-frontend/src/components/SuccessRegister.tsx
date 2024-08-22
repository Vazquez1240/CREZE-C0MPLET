import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import {SucessResponse} from "../interfaces/login.ts";
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import {Link} from "react-router-dom";
import {Button} from "@mui/material";

interface Props {
    dialogo: SucessResponse
}

const SuccesRegister = ({ dialogo }: Props) => {
    const {titulo, openDialog, message} = dialogo;
    return (
        <Dialog open={openDialog} style={{display: 'flex', justifyContent: 'center', padding: '2em'}}>
            <DialogTitle style={{display: 'flex', justifyContent:'center'}}>{titulo.toUpperCase()}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
                <Button>
                    <Link to={'/'}>Iniciar sesión</Link>
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default SuccesRegister;
