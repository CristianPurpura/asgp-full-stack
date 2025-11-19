import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, Usuario } from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  currentUser = signal<Usuario | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // ======= COGNITO =======
  private get redirectUri(): string {
    const loc = window.location;
    // Si estamos detrás de CloudFront, usar origen actual
    return `${loc.protocol}//${loc.host}${environment.cognito.redirectPath}`;
  }

  loginWithCognito(): void {
    const domain = environment.cognito['domain'];
    const clientId = environment.cognito['clientId'];
    const redirectUri = encodeURIComponent(this.redirectUri);
    const scope = encodeURIComponent('openid email profile');
    const url = `${domain}/login?client_id=${clientId}&response_type=token&scope=${scope}&redirect_uri=${redirectUri}`;
    window.location.href = url;
  }

  handleCognitoCallback(): void {
    // Los tokens vienen en el hash: #id_token=...&access_token=...&expires_in=...
    const hash = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');
    if (!idToken) return;

    // Decodificar payload del JWT
    const payload = JSON.parse(atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    const usuario: Usuario = {
      id: 0,
      nombre_completo: payload['name'] || payload['email'] || 'Usuario',
      mail: payload['email'] || '',
      rol: payload['custom:rol'] || 'EMPLEADO'
    } as any;

    this.setSession(idToken, usuario);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response?.success) {
          const token = response?.data?.token ?? response?.token;
          const usuario = response?.data?.usuario ?? response?.usuario;
          if (token && usuario) {
            this.setSession(token, usuario);
          }
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  private setSession(token: string, usuario: Usuario): void {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.currentUser.set(usuario);
    this.isAuthenticated.set(true);
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const usuarioStr = localStorage.getItem('usuario');
    
    if (token && usuarioStr) {
      try {
        const usuario = JSON.parse(usuarioStr);
        this.currentUser.set(usuario);
        this.isAuthenticated.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return this.currentUser()?.rol === 'ADMIN';
  }

  isEmpleado(): boolean {
    return this.currentUser()?.rol === 'EMPLEADO' || this.isAdmin();
  }
}
