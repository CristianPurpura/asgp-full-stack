import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../models/producto.model';
import { LayoutComponent } from '../shared/layout';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LayoutComponent],
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {
  productos = signal<Producto[]>([]);
  loading = signal(true);
  showModal = signal(false);
  productoEditando: Producto | null = null;

  // Formulario
  nombre = '';
  descripcion = '';
  categoria = '';
  precio = 0;

  constructor(
    public authService: AuthService,
    private productoService: ProductoService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading.set(true);
    if (this.authService.isAdmin()) {
      this.productoService.getProductos().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.productos.set(response.data);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      // Empleado: mostrar solo productos con stock en sucursal > 0
      this.stockService.getStock().subscribe({
        next: (resp) => {
          if (resp.success && resp.data) {
            const conStock = resp.data
              .filter((s: any) => (s.CANTIDAD_SUCURSAL || 0) > 0)
              .map((s: any) => ({
                ID: s.ID_PRODUCTO,
                NOMBRE: s.NOMBRE,
                DESCRIPCION: s.DESCRIPCION,
                CATEGORIA: s.CATEGORIA,
                PRECIO: s.PRECIO
              } as Producto));
            this.productos.set(conStock);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  abrirModalNuevo(): void {
    this.productoEditando = null;
    this.nombre = '';
    this.descripcion = '';
    this.categoria = '';
    this.precio = 0;
    this.showModal.set(true);
  }

  abrirModalEditar(producto: Producto): void {
    this.productoEditando = producto;
    this.nombre = producto.NOMBRE;
    this.descripcion = producto.DESCRIPCION;
    this.categoria = producto.CATEGORIA;
    this.precio = producto.PRECIO;
    this.showModal.set(true);
  }

  guardarProducto(): void {
    const datos = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      categoria: this.categoria,
      precio: this.precio
    };

    if (this.productoEditando) {
      // Actualizar
      this.productoService.updateProducto(this.productoEditando.ID, datos).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarProductos();
          alert('Producto actualizado exitosamente');
        },
        error: (err) => alert(err.error?.message || 'Error al actualizar producto')
      });
    } else {
      // Crear
      this.productoService.createProducto(datos).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarProductos();
          alert('Producto creado exitosamente');
        },
        error: (err) => alert(err.error?.message || 'Error al crear producto')
      });
    }
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe({
        next: () => {
          this.cargarProductos();
          alert('Producto eliminado exitosamente');
        },
        error: (err) => alert(err.error?.message || 'Error al eliminar producto')
      });
    }
  }

  cerrarModal(): void {
    this.showModal.set(false);
  }
}
