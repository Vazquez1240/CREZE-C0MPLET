import axios from 'axios'
import {LoginBody, RefreshToken, Register} from "../interfaces/login.ts";
import UserData from "../stores/userData.ts";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
});

export const login = async (loginData: LoginBody) => {
    const response = await api.post('/rest/v1/login/', loginData);
    return response.data;
};

export const refreshToken = async (refresh: RefreshToken) => {
    try{
        const response = await api.post('/rest/v1/refresh-token/', refresh);
        if(response.status === 400){
            console.log('hay error')
        }
        return response.data;
    }catch(error){
        // @ts-ignore
        return {
            error: error.response.data.error
        }
    }
}

export const register = async (registerData: Register) => {
    const response = await api.post('/rest/v1/register/', registerData);
    return response.data;
}

export const verifyToken = async (accessToken: string) => {
    const response = await api.post('rest/v1/users/verify-token/verify/', {},  {
            headers: { Authorization: `Bearer ${accessToken}` }
        }
    );
    return response.data;
};

export const SubirDocumento = async (documentos: File[]) => {
    const formData = new FormData();

    documentos.forEach((documento) => {
        formData.append('file', documento);
    });

    try {
        const response = await api.post('/rest/v1/document-upload/', formData, {
            headers: {
                'Authorization': `Bearer ${UserData.access_token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al subir documentos:', error);
        throw error; // Maneja el error según sea necesario
    }
};
