
export interface LoginBody{
    email: string;
    password: string;
}

export interface Register{
    email: string;
    username: string;
    password: string;
    password2: string;
}

export interface RefreshToken{
    refresh?:string;
    error?:string
}

export interface LoginResponse {
    access: string;
    refresh: string;
    error?: string
}

export interface RegisterResponse {
    status: string;
}

export interface SucessResponse{
    openDialog: boolean;
    titulo: string;
    message: string;
}

export interface ComponenteError {
    numero_error: string;
    mensaje: string;
    url_redireccion: string;
}

export interface ResponseverifyToken {
    status: string;
}
