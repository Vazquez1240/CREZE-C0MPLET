import axios from 'axios'
import {LoginBody, RefreshToken, Register} from "../interfaces/login.ts";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
});

export const login = async (loginData: LoginBody) => {
    const response = await api.post('/rest/v1/login/', loginData);
    return response.data;
};

export const refreshToken = async (refresh: RefreshToken) => {
    const response = await api.post('/rest/v1/refresh-token/', refresh);
    return response.data;
}

export const register = async (registerData: Register) => {
    const response = await api.post('/rest/v1/register/', registerData);
    return response.data;
}

export const verifyToken = async (accessToken: string) => {
    const response = await api.post('rest/v1/verify-token/', {},  {
            headers: { Authorization: `Bearer ${accessToken}` }
        }
    );
    return response.data;
};

