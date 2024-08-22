import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import {Archive} from "@mui/icons-material";
import {Register, RegisterResponse} from "../interfaces/login.ts";
import {register} from "../api/api.ts";
import SuccessRegister from "./SuccessRegister.tsx";

export default function FormularioRegistro() {
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ user:'', email: '', password: '', password2: '' });
    const [password2, setPassword2] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [message, setMessage] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const data = {openDialog, message, titulo}

    const validate = () => {
        let isValid = true;
        let errors = { user:'', email: '', password: '', password2: '' };


        if (!user) {
            errors.user = 'El campo del usuario es requerido';
            isValid = false;
        }

        if (!user) {
            errors.email = 'El correo es obligatorio';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'El correo no es válido';
            isValid = false;
        }

        if (!password) {
            errors.password = 'La contraseña es obligatoria';
            isValid = false;
        }

         if (!password2) {
            errors.password2 = 'Este campo es obligatoria';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            const registerData: Register = {
                username: user,
                email: email,
                password: password,
                password2: password2
            }
            try {
                const response:RegisterResponse = await register(registerData);
                if(response.status === '201'){
                    setTitulo('Felicidades :)')
                    setMessage('Se ha creado correctamente tu usuario, ahora puedes iniciar sesion UwU')
                    setOpenDialog(true)

                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardContent>
                    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <div className='flex items-center justify-center'>
                                <Archive style={{fontSize: '4rem'}}/>
                            </div>
                            <h2 className="mt-10 text-center text-2xl leading-9 tracking-tight text-gray-900">
                                Registrate para poder acceder a tu dashboard de documentos
                            </h2>
                        </div>

                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="email"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Ingresa un correo electronico
                                    </label>
                                    <div className="mt-2">
                                        <TextField
                                            id="email"
                                            variant="standard"
                                            className='w-full'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password"
                                               className="block text-sm font-medium leading-6 text-gray-900">
                                            Ingrese un nombre de usuario
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <TextField
                                            id="user"
                                            variant="standard"
                                            className='w-full'
                                            value={user}
                                            onChange={(e) => setUser(e.target.value)}
                                            error={!!errors.user}
                                            helperText={errors.user}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password"
                                               className="block text-sm font-medium leading-6 text-gray-900">
                                            Ingrese una contraseña
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <TextField
                                            id="password"
                                            type="password"
                                            variant="standard"
                                            className='w-full'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            error={!!errors.password}
                                            helperText={errors.password}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password"
                                               className="block text-sm font-medium leading-6 text-gray-900">
                                            Porfavor confirme su contraseña
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <TextField
                                            id="password2"
                                            type="password"
                                            variant="standard"
                                            className='w-full'
                                            value={password2}
                                            onChange={(e) => setPassword2(e.target.value)}
                                            error={!!errors.password2}
                                            helperText={errors.password2}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Registrarte
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <SuccessRegister dialogo={data} />
                </CardContent>
            </Card>
        </form>
    )
}
