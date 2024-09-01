import React, {useState} from "react";
import FormularioLogin from "../components/FormularioLogin";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";
import { observer } from 'mobx-react-lite';
import useUserData from "../stores/userData.ts";
import CircularProgress from '@mui/material/CircularProgress';

const Home = observer(() => {
    const navigate = useNavigate();
    const [isAutenticate, setAutenticate] = useState(false);
    const [loading, setLoading] = useState(false);

      useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          navigate('/home');
        }
      }, [navigate]);

    return (
        loading ? (
            <>
                <CircularProgress />
            </>

        ) : (
            <section className='h-screen w-full flex flex-col items-center justify-center'>
                <FormularioLogin />
            </section>
        )
    )
})

export default Home;
