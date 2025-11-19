import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CierreCaja, CajaActual, CerrarCajaRequest } from '../models/cierre-caja.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CierreCajaService {
  private apiUrl = `${environment.apiUrl}/cierre-caja`;

  constructor(private http: HttpClient) { }

  getCajaActual(): Observable<ApiResponse<CajaActual>> {
    return this.http.get<ApiResponse<CajaActual>>(`${this.apiUrl}/actual`);
  }

  abrirCaja(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/abrir`, {});
  }

  cerrarCaja(datos: CerrarCajaRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/cerrar`, datos);
  }

  getCierresCaja(): Observable<ApiResponse<CierreCaja[]>> {
    return this.http.get<ApiResponse<CierreCaja[]>>(this.apiUrl);
  }

  getHistorialCierres(idEmpleado: number): Observable<ApiResponse<CierreCaja[]>> {
    return this.http.get<ApiResponse<CierreCaja[]>>(`${this.apiUrl}/empleado/${idEmpleado}`);
  }

  getCierreCajaById(id: number): Observable<ApiResponse<CierreCaja>> {
    return this.http.get<ApiResponse<CierreCaja>>(`${this.apiUrl}/${id}`);
  }
}
