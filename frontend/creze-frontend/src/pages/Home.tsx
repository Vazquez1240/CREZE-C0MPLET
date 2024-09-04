import React, {useState} from "react";
import FormularioLogin from "../components/FormularioLogin";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";
import { observer } from 'mobx-react-lite';

const Home = observer(() => {
    const navigate = useNavigate();

      useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          navigate('/inicio');
        }
      }, [navigate]);

    return (
        <section className='h-screen w-full flex flex-col items-center justify-center'>
            <FormularioLogin/>
        </section>
    )
})

export default Home;
