import {refreshToken} from "../api/api.ts";
import useUserData from "../stores/userData.ts";
import {LoginResponse} from "../interfaces/login.ts";

export default async function  RefreshTokenFunctio () {
    const data = {
        refresh: localStorage.getItem('refresh_token')
    }

    const response:LoginResponse = await refreshToken(data)
    console.log(response, 'response')
    if( !response.error ){
        useUserData.setDataUser(response.access, response.refresh, useUserData.email, useUserData.password)
        window.location.reload();
    }else{
        await useUserData.clearDataUser()
        window.location.href = '/'

    }

}
