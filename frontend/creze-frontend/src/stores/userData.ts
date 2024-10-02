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

    if (storedAccessToken && storedRefreshToken) {
      this.access_token = storedAccessToken;
      this.refresh_token = storedRefreshToken;
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
      response.status === 'Token is valid' ? this.isAuthenticated = true : this.isAuthenticated = false;
      return {
        'status': 200,
        'isAuthenticated': this.isAuthenticated,
        'message': 'the session is correct'
      }
    } catch(error:any) {
      this.isAuthenticated = false;
      return {
        'status': 400,
        'message': error.response.data.detail
      }
    }
  }

  clearDataUser(): void {
    this.access_token = '';
    this.refresh_token = '';

    // Limpiar el localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('email')
  }
}

const useUserData = new UserData();
export default useUserData;
