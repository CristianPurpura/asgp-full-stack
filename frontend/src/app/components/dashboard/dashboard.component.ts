import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';
import { VentaService } from '../../services/venta.service';
import { StockService } from '../../services/stock.service';
import { LayoutComponent } from '../shared/layout';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LayoutComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usuario = this.authService.currentUser;
  totalProductos = signal(0);
  totalVentas = signal(0);
  stockBajo = signal(0);
  loading = signal(true);

  constructor(
    public authService: AuthService,
    private router: Router,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Cargar productos
    this.productoService.getProductos().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.totalProductos.set(response.data.length);
        }
      }
    });

    // Cargar estadísticas de ventas
    this.ventaService.getEstadisticas().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.totalVentas.set(response.data.estadisticas_generales.total_vendido || 0);
        }
      }
    });

    // Cargar stock bajo
    this.stockService.getStockBajo().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stockBajo.set(response.data.length);
        }
        this.loading.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
