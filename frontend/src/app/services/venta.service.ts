import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Venta, CreateVentaRequest, EstadisticasVentas } from '../models/venta.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = `${environment.apiUrl}/ventas`;

  constructor(private http: HttpClient) { }

  getVentas(): Observable<ApiResponse<Venta[]>> {
    return this.http.get<ApiResponse<Venta[]>>(this.apiUrl);
  }

  getVentaById(id: number): Observable<ApiResponse<Venta>> {
    return this.http.get<ApiResponse<Venta>>(`${this.apiUrl}/${id}`);
  }

  getVentasByUsuario(idUsuario: number): Observable<ApiResponse<Venta[]>> {
    return this.http.get<ApiResponse<Venta[]>>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  getVentasByFecha(fechaInicio: string, fechaFin: string): Observable<ApiResponse<Venta[]>> {
    return this.http.get<ApiResponse<Venta[]>>(`${this.apiUrl}/fecha?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`);
  }

  getEstadisticas(): Observable<ApiResponse<EstadisticasVentas>> {
    return this.http.get<ApiResponse<EstadisticasVentas>>(`${this.apiUrl}/estadisticas`);
  }

  createVenta(venta: CreateVentaRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, venta);
  }
}
