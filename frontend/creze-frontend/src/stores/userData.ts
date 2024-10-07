import { makeAutoObservable } from 'mobx';
import {verifyToken} from "../api/api.ts";
import {ResponseverifyToken} from "../interfaces/login.ts";

class UserData {
  email = '';
  password = '';
  access_token = '';
  refresh_token = '';
  isAuthenticated = false;

  constructor() {
    const storedAccessToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    const storeEmail = localStorage.getItem('email');

    if (storedAccessToken && storedRefreshToken && storeEmail) {
      this.access_token = storedAccessToken;
      this.refresh_token = storedRefreshToken;
      this.email = storeEmail;
    }

    makeAutoObservable(this);
  }

  setIsAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }

  setDataUser(access_token: string, refresh_token: string, email:string, password: string): void {
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.email = email;
    this.password = password;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('email', email);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('email', email);
  }

  async checkAuthentication() {
    try {
      const response: ResponseverifyToken = await verifyToken(this.access_token);
      response.status === 401 ?  this.isAuthenticated = false : this.isAuthenticated = true;
      return this.isAuthenticated ? {
        'status': 200,
        'isAuthenticated': this.isAuthenticated,
        'message': 'the session is correct'
      }:{
        'status': 400,
        'message': response.data.detail
      }
    } catch(error:any) {
      this.isAuthenticated = false;
      return {
        'status': 400,
        'message': error.response.data.detail
      }
    }
  }

  clearDataUser(): boolean {
    this.access_token = '';
    this.refresh_token = '';

    // Limpiar el localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('email')

    return true
  }
}

const useUserData = new UserData();
export default useUserData;
