import { makeAutoObservable } from 'mobx';

class UserData {
  access_token = '';
  refresh_token = '';

  constructor() {
    const storedAccessToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');

    if (storedAccessToken && storedRefreshToken) {
      this.access_token = storedAccessToken;
      this.refresh_token = storedRefreshToken;
    }

    makeAutoObservable(this);
  }

  setDataUser(access_token: string, refresh_token: string): void {
    this.access_token = access_token;
    this.refresh_token = refresh_token;

    // Guardar en localStorage
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  }

  clearDataUser(): void {
    this.access_token = '';
    this.refresh_token = '';

    // Limpiar el localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

const useUserData = new UserData();
export default useUserData;
