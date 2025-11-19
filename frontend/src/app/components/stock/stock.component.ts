import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { AuthService } from '../../services/auth.service';
import { Stock } from '../../models/stock.model';
import { LayoutComponent } from '../shared/layout';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LayoutComponent],
  template: `
    <app-layout>
      <div class="page-header">
        <h2>📦 Gestión de Stock</h2>
      </div>

      <div class="content-wrapper">
        <div class="content-card">

          @if (loading()) {
            <div style="text-align: center; padding: 3rem;">
              <div style="border: 3px solid #f3f3f3; border-top: 3px solid #1976d2; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
              <p style="margin-top: 1rem; color: #666;">Cargando stock...</p>
            </div>
          } @else {
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Depósito</th>
                  <th>Sucursal</th>
                  <th>Total</th>
                  @if (authService.isAdmin()) {
                    <th>Acciones</th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (item of stock(); track item.ID) {
                  <tr>
                    <td>{{ item.NOMBRE }}</td>
                    <td>{{ item.CATEGORIA }}</td>
                    <td>\${{ item.PRECIO }}</td>
                    <td>{{ item.CANTIDAD_DEPOSITO }}</td>
                    <td>{{ item.CANTIDAD_SUCURSAL }}</td>
                    <td>{{ item.CANTIDAD_TOTAL }}</td>
                    @if (authService.isAdmin()) {
                      <td>
                        <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.875rem;">Gestionar</button>
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    </app-layout>
  `
})
export class StockComponent implements OnInit {
  stock = signal<Stock[]>([]);
  loading = signal(true);

  constructor(
    public authService: AuthService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.stockService.getStock().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stock.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
