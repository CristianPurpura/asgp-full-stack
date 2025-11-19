import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Stock, UpdateStockRequest, TransferirStockRequest } from '../models/stock.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = `${environment.apiUrl}/stock`;

  constructor(private http: HttpClient) { }

  getStock(): Observable<ApiResponse<Stock[]>> {
    return this.http.get<ApiResponse<Stock[]>>(this.apiUrl);
  }

  getStockByProducto(idProducto: number): Observable<ApiResponse<Stock>> {
    return this.http.get<ApiResponse<Stock>>(`${this.apiUrl}/producto/${idProducto}`);
  }

  getStockBajo(limite: number = 10): Observable<ApiResponse<Stock[]>> {
    return this.http.get<ApiResponse<Stock[]>>(`${this.apiUrl}/bajo?limite=${limite}`);
  }

  updateStock(idProducto: number, stock: UpdateStockRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/producto/${idProducto}`, stock);
  }

  transferirStock(transferencia: TransferirStockRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/transferir`, transferencia);
  }
}
