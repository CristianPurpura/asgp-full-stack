import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  ID_USUARIO: number;
  NOMBRE: string;
  APELLIDO: string;
  EMAIL: string;
  ROL: 'ADMIN' | 'EMPLEADO';
  ACTIVO: boolean;
  FECHA_CREACION?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = '/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  createUsuario(usuario: any): Observable<any> {
    // Transformar al formato que espera el backend
    const payload = {
      nombre_completo: `${usuario.NOMBRE} ${usuario.APELLIDO}`,
      mail: usuario.EMAIL,
      contraseña: usuario.PASSWORD,
      rol: usuario.ROL
    };
    return this.http.post<any>(this.apiUrl, payload);
  }

  updateUsuario(id: number, usuario: any): Observable<any> {
    // Transformar al formato que espera el backend
    const payload: any = {};
    if (usuario.NOMBRE && usuario.APELLIDO) {
      payload.nombre_completo = `${usuario.NOMBRE} ${usuario.APELLIDO}`;
    }
    if (usuario.EMAIL) {
      payload.mail = usuario.EMAIL;
    }
    if (usuario.ROL) {
      payload.rol = usuario.ROL;
    }
    if (usuario.ACTIVO !== undefined) {
      payload.activo = usuario.ACTIVO;
    }
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener empleados para filtros
  getEmpleados(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?rol=EMPLEADO`);
  }
}

