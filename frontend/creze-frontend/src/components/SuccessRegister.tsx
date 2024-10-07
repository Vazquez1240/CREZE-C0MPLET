import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import {SucessResponse} from "../interfaces/login.ts";
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import {Link} from "react-router-dom";
import {Button, DialogActions} from "@mui/material";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
interface Props {
    dialogo: SucessResponse
}

const SuccesRegister = ({ dialogo }: Props) => {
    const {titulo, openDialog, message} = dialogo;
    return (
        <Dialog
            open={openDialog}
            style={{display: 'flex', justifyContent: 'center', padding: '2em'}}
        >
            <DialogTitle id="titulo-dialogo-registro" sx={{ textAlign: 'center' }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" component="div">
                    ¡Registro Exitoso!
                </Typography>
            </DialogTitle>
            <DialogContent className='flex flex-col gap-2'>
                <DialogContentText style={{color: 'black'}}>
                    {message}
                </DialogContentText>
                <DialogActions className='flex justify-end gap-3'>
                    <Button variant={'outlined'}
                        size='medium'>
                        <Link to={'/'}>Entendido</Link>
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}

export default SuccesRegister;
