import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { Person } from '@mui/icons-material';
import {login} from "../api/api.ts";
import {LoginBody, LoginResponse} from "../interfaces/login.ts";
import useUserData from "../stores/userData.ts";
import {Link, useNavigate} from "react-router-dom";


export default function FormularioLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate()

    // Validar campos
    const validate = () => {
        let isValid = true;
        let errors = { email: '', password: '' };

        if (!email) {
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

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            const loginData: LoginBody = {
                email: email,
                password: password,
            }
            try {
                const response:LoginResponse = await login(loginData);
                useUserData.setDataUser(response.access, response.refresh, email, password);
                navigate('/inicio');
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
                                <Person style={{ fontSize: '4rem' }} />
                            </div>
                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Inicia sesión con tu cuenta
                            </h2>
                        </div>

                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Ingrese su correo
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
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                            Ingrese su contraseña
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
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        {isSubmitting ? 'Enviando...' : 'Ingresar'}
                                    </button>
                                </div>
                                <div>
                                    <Link to={'/register'}>Crear cuenta</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
