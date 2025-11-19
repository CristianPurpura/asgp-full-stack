import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VentaService } from '../../services/venta.service';
import { ProductoService } from '../../services/producto.service';
import { StockService } from '../../services/stock.service';
import { AuthService } from '../../services/auth.service';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { LayoutComponent } from '../shared/layout';
import { CierreCajaService } from '../../services/cierre-caja.service';
import { Venta } from '../../models/venta.model';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="page-header">
  <h2>💰 Ventas</h2>
        @if (!authService.isAdmin()) {
          @if (cajaAbierta()) {
            <button class="btn btn-success" (click)="abrirModal()">+ Registrar venta</button>
          }
        }
      </div>

      <div class="content-wrapper">
        <div class="content-card">

          @if (authService.isAdmin()) {
            <div style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap; align-items: end;">
              <div>
                <label style="display: block; margin-bottom: 0.25rem; font-size: 0.875rem; color: rgba(255,255,255,0.8);">Fecha Inicio:</label>
                <input type="date" [(ngModel)]="fechaInicio" (change)="aplicarFiltros()" class="form-control">
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.25rem; font-size: 0.875rem; color: rgba(255,255,255,0.8);">Fecha Fin:</label>
                <input type="date" [(ngModel)]="fechaFin" (change)="aplicarFiltros()" class="form-control">
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.25rem; font-size: 0.875rem; color: rgba(255,255,255,0.8);">Empleado:</label>
                <select [(ngModel)]="empleadoSeleccionado" (change)="aplicarFiltros()" class="form-control" style="min-width: 180px;">
                  <option [value]="0">Todos los empleados</option>
                  @for (empleado of empleados(); track empleado.ID_USUARIO) {
                    <option [value]="empleado.ID_USUARIO">{{ empleado.NOMBRE }} {{ empleado.APELLIDO }}</option>
                  }
                </select>
              </div>
              <button class="btn btn-primary" (click)="limpiarFiltros()">Limpiar</button>
            </div>
          } @else {
            @if (!cajaAbierta()) {
              <div style="margin-top: 1rem; padding: 1rem; border: 1px dashed rgba(255,152,0,0.5); background: rgba(255,152,0,0.1); border-radius: 6px; color: rgba(255,255,255,0.9);">
                <div style="display:flex; align-items:center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                  <div>
                    <strong>Tu caja no está abierta.</strong>
                    <div>Para ver y registrar ventas, primero abrí tu caja.</div>
                  </div>
                  <button (click)="abrirCaja()" class="btn btn-primary">Abrir caja</button>
                </div>
              </div>
            } @else {
              <p style="margin-top: 1rem; color: rgba(255,255,255,0.7); font-size: 0.9rem;">
                📅 Ventas desde la apertura de caja: {{ fechaAperturaCaja | date: 'dd/MM/yyyy HH:mm' }}
              </p>
            }
          }

          @if (loading()) {
            <div class="loading"><div class="spinner"></div><p>Cargando ventas...</p></div>
          } @else {
            @if (authService.isAdmin()) {
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  @for (venta of ventas(); track venta.ID) {
                    <tr>
                      <td>{{ venta.ID }}</td>
                      <td>{{ venta.FECHA | date:'short' }}</td>
                      <td>{{ venta.NOMBRE_USUARIO }}</td>
                      <td>{{ venta.NOMBRE_PRODUCTO }}</td>
                      <td>{{ venta.CANTIDAD }}</td>
                      <td>\${{ venta.TOTAL }}</td>
                    </tr>
                  }
                  @empty {
                    <tr>
                      <td colspan="6" style="text-align:center; padding: 1rem; color: rgba(255,255,255,0.7);">Sin ventas</td>
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              @if (!cajaAbierta()) {
                <div style="margin-top: 1rem; color: rgba(255,255,255,0.7);">No hay ventas para mostrar.</div>
              } @else {
                @if (gruposVentas().length === 0) {
                  <div class="content-card" style="margin-top: 1rem; text-align: center;">
                    <p style="margin: 0;">Aún no hay ventas registradas desde la apertura de caja.</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem;">Presioná "+ Registrar venta" para comenzar.</p>
                  </div>
                } @else {
                  <div style="margin-top: 1rem;">
                    @for (grupo of gruposVentas(); track grupo.id) {
                      <div class="content-card" style="margin-bottom: 0.75rem;">
                        <div (click)="toggleGrupo(grupo.id)" style="cursor: pointer; padding: 0.75rem 1rem; display:flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,255,255,0.2);">
                          <div>
                            <div style="font-weight:600; color: white;">Venta</div>
                            <div style="color:rgba(255,255,255,0.7); font-size: 0.85rem;">{{ grupo.fecha | date:'HH:mm' }} • {{ grupo.items.length }} ítem(s)</div>
                          </div>
                          <div style="font-weight:600; color: #0ff;">\${{ grupo.total | number:'1.2-2' }}</div>
                        </div>
                        @if (grupoExpandido(grupo.id)) {
                          <table>
                            <thead>
                              <tr>
                                <th>Producto</th>
                                <th style="text-align:center;">Cantidad</th>
                                <th style="text-align:right;">Precio</th>
                                <th style="text-align:right;">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              @for (item of grupo.items; track item.ID) {
                                <tr>
                                  <td>{{ item.NOMBRE_PRODUCTO }}</td>
                                  <td style="text-align:center;">{{ item.CANTIDAD }}</td>
                                  <td style="text-align:right;">\${{ item.PRECIO_UNITARIO | number:'1.2-2' }}</td>
                                  <td style="text-align:right; font-weight:600; color: #0ff;">\${{ item.TOTAL | number:'1.2-2' }}</td>
                                </tr>
                              }
                            </tbody>
                          </table>
                        }
                      </div>
                    }
                  </div>
                }
              }
            }
          }
        </div>
      </div>

      <!-- Modal Make Sale -->
      @if (showModal()) {
        <div class="modal-overlay" (click)="cerrarModal()">
          <div class="modal-content" (click)="$event.stopPropagation()" style="max-height: 85vh; width: 95%; max-width: 900px; display: flex; flex-direction: column;">
            <div class="modal-header">
              <h3 class="modal-title">Ventas</h3>
              <button class="modal-close" (click)="cerrarModal()">×</button>
            </div>
            <div class="modal-body" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;">
              <!-- Buscar producto -->
              <div class="form-group">
                <div style="display: flex; gap: 0.5rem;">
                  <input type="text" [(ngModel)]="searchTerm" (input)="buscarProducto()" placeholder="🔍 Buscar producto..." class="form-control" style="flex:1;" />
                  <button type="button" class="btn btn-secondary" style="white-space: nowrap;">Agregar producto</button>
                </div>
                @if (searchTerm && productosFiltrados().length > 0) {
                  <div class="content-card" style="margin-top: 0.5rem; max-height: 150px; overflow-y: auto; padding: 0;">
                    @for (producto of productosFiltrados(); track producto.ID) {
                      <div (click)="agregarAlCarrito(producto)" style="padding: 0.75rem; border-bottom: 1px solid rgba(0,255,255,0.2); cursor: pointer;">
                        <div style="font-weight: 500; font-size: 0.9rem; color: #fff;">{{ producto.NOMBRE }}</div>
                        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">{{ producto.CATEGORIA }} - \${{ producto.PRECIO }}</div>
                      </div>
                    }
                  </div>
                }
                @if (searchTerm && productosFiltrados().length === 0) {
                  <div class="content-card" style="margin-top: 0.5rem; padding: 1rem; text-align: center; color: rgba(255,255,255,0.7); border: 1px dashed rgba(0,255,255,0.3);">
                    No se encontraron productos
                  </div>
                }
              </div>

              <!-- Carrito -->
              <div class="content-card" style="overflow: auto; margin-bottom: 1.5rem;">
                @if (carrito().length === 0) {
                  <div class="loading">
                    <p style="margin: 0; font-size: 0.95rem;">No hay productos agregados</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: rgba(255,255,255,0.6);">Busca y agrega productos para comenzar la venta</p>
                  </div>
                } @else {
                  <table>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th style="text-align: center;">Cant.</th>
                        <th style="text-align: right;">Precio</th>
                        <th style="text-align: right;">Subtotal</th>
                        <th style="width: 40px;"></th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (item of carrito(); track item.ID) {
                        <tr>
                          <td>{{ item.NOMBRE }}</td>
                          <td style="text-align: center;">
                            <div style="display: inline-flex; align-items: center; gap: 0.5rem;">
                              <button (click)="cambiarCantidad(item.ID, -1)" class="btn btn-secondary" style="width: 28px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center;">−</button>
                              <span style="min-width: 28px; text-align: center; display:inline-block;">{{ item.cantidad }}</span>
                              <button (click)="cambiarCantidad(item.ID, 1)" class="btn btn-secondary" style="width: 28px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center;">+</button>
                            </div>
                          </td>
                          <td style="text-align: right;">\${{ item.PRECIO.toFixed(2) }}</td>
                          <td style="text-align: right; font-weight: 600; color: #0ff;">\${{ item.subtotal.toFixed(2) }}</td>
                          <td style="text-align: center;">
                            <button (click)="eliminarDelCarrito(item.ID)" class="btn btn-danger btn-icon" style="width: 28px; height: 28px; padding: 0;">🗑️</button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                }
              </div>

            </div>

            <!-- Footer fijo (no scrollea) -->
            <div style="padding: 1rem; border-top: 1px solid rgba(0,255,255,0.2); background: rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; justify-content: flex-end;">
                <div style="text-align: right;">
                  <div style="font-size: 0.875rem; color: rgba(255,255,255,0.7); margin-bottom: 0.25rem;">TOTAL</div>
                  <div style="font-size: 1.5rem; font-weight: 600; color: #0ff;">\${{ total().toFixed(2) }}</div>
                </div>
              </div>
              <div style="display: flex; gap: 0.75rem;">
                <button (click)="finalizarVenta()" [disabled]="carrito().length === 0" class="btn btn-success" style="flex: 1;" [style.opacity]="carrito().length === 0 ? '0.5' : '1'" [style.cursor]="carrito().length === 0 ? 'not-allowed' : 'pointer'">Finalizar venta</button>
                <button (click)="cerrarModal()" class="btn btn-secondary" style="flex: 1;">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      }
    </app-layout>
  `
})
export class VentasComponent implements OnInit {
  // Datos y estado
  ventas = signal<Venta[]>([]);
  empleados = signal<Usuario[]>([]);
  productos = signal<any[]>([]);
  productosFiltrados = signal<any[]>([]);
  carrito = signal<any[]>([]);
  total = signal<number>(0);
  loading = signal<boolean>(false);
  showModal = signal<boolean>(false);
  cajaAbierta = signal<boolean>(false);
  gruposVentas = signal<any[]>([]);

  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  empleadoSeleccionado: number = 0;

  // UI y helpers
  searchTerm: string = '';
  fechaAperturaCaja: Date | null = null;
  private gruposExpandidos = new Set<string>();

  constructor(
    public authService: AuthService,
    private ventaService: VentaService,
    private productoService: ProductoService,
    private stockService: StockService,
    private usuarioService: UsuarioService,
    private cierreCajaService: CierreCajaService
  ) {}

  ngOnInit(): void {
    // Cargar catálogo de productos (desde stock para conocer CANTIDAD_SUCURSAL)
    this.cargarCatalogoProductos();

    if (this.authService.isAdmin()) {
      this.cargarVentas();
      this.cargarEmpleados();
    } else {
      this.verificarCajaYAbrirDatos();
    }
  }

  private cargarCatalogoProductos(): void {
    this.stockService.getStock().subscribe({
      next: (resp) => {
        if ((resp as any)?.success && (resp as any)?.data) {
          const lista = (resp as any).data.map((s: any) => ({
            ID: s.ID_PRODUCTO,
            NOMBRE: s.NOMBRE,
            CATEGORIA: s.CATEGORIA,
            PRECIO: s.PRECIO,
            CANTIDAD_SUCURSAL: s.CANTIDAD_SUCURSAL
          }));
          this.productos.set(lista);
          this.productosFiltrados.set(lista);
        } else if (Array.isArray((resp as any))) {
          // fallback por si el backend devuelve array directo
          const lista = (resp as any).map((s: any) => ({
            ID: s.ID_PRODUCTO ?? s.ID,
            NOMBRE: s.NOMBRE,
            CATEGORIA: s.CATEGORIA,
            PRECIO: s.PRECIO,
            CANTIDAD_SUCURSAL: s.CANTIDAD_SUCURSAL
          }));
          this.productos.set(lista);
          this.productosFiltrados.set(lista);
        }
      }
    });
  }

  private cargarEmpleados(): void {
    this.usuarioService.getEmpleados().subscribe({
      next: (data) => this.empleados.set(data || []),
      error: () => this.empleados.set([])
    });
  }

  // Normaliza fecha a hora local
  toLocalDate(fecha: string | Date): Date {
    if (fecha instanceof Date) return fecha;
    if (!fecha) return new Date();
    const s = String(fecha);
    return new Date(s.endsWith('Z') ? s.replace('Z', '') : s);
  }

  private verificarCajaYAbrirDatos(): void {
    this.loading.set(true);
    this.cierreCajaService.getCajaActual().subscribe({
      next: (resp: any) => {
        const data = resp?.data || null;
        if (!data) {
          this.cajaAbierta.set(false);
          this.ventas.set([]);
          this.gruposVentas.set([]);
          this.loading.set(false);
        } else {
          this.cajaAbierta.set(true);
          this.fechaAperturaCaja = this.toLocalDate(data.cierre.FECHA_APERTURA);
          this.cargarVentasEmpleadoDesdeApertura();
        }
      },
      error: () => {
        this.cajaAbierta.set(false);
        this.loading.set(false);
      }
    });
  }

  cargarVentas(): void {
    this.loading.set(true);
    this.ventaService.getVentas().subscribe({
      next: (response) => {
        if ((response as any)?.success && (response as any)?.data) {
          this.ventas.set((response as any).data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private cargarVentasEmpleadoDesdeApertura(): void {
    const userId = (this.authService.currentUser() as any)?.id;
    if (!userId) {
      this.loading.set(false);
      return;
    }
    this.ventaService.getVentasByUsuario(userId).subscribe({
      next: (response) => {
        if ((response as any)?.success && (response as any)?.data) {
          const lista = (response as any).data;
          this.ventas.set(lista);
          this.recalcularGrupos();
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private recalcularGrupos(): void {
    const map = new Map<string, { id: string; fecha: Date; items: any[]; total: number }>();
    for (const v of this.ventas()) {
      const grupoId = (v as any).NUMERO_VENTA || this.formatearGrupoPorFecha((v as any).FECHA);
      const fecha = this.toLocalDate((v as any).FECHA);
      if (!map.has(grupoId)) {
        map.set(grupoId, { id: grupoId, fecha, items: [], total: 0 });
      }
      const g = map.get(grupoId)!;
      g.items.push(v);
      g.total += Number((v as any).TOTAL) || 0;
      if (fecha > g.fecha) g.fecha = fecha;
    }
    const grupos = Array.from(map.values()).sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    this.gruposVentas.set(grupos);
  }

  private formatearGrupoPorFecha(fechaStr: string): string {
    const d = this.toLocalDate(fechaStr);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${y}-${m}-${day} ${hh}:${mm}`;
  }

  grupoExpandido(id: string): boolean { return this.gruposExpandidos.has(id); }
  toggleGrupo(id: string): void {
    if (this.gruposExpandidos.has(id)) this.gruposExpandidos.delete(id); else this.gruposExpandidos.add(id);
  }

  aplicarFiltros(): void {
    this.loading.set(true);
    if (this.empleadoSeleccionado > 0) {
      this.ventaService.getVentasByUsuario(this.empleadoSeleccionado).subscribe({
        next: (response) => {
          if ((response as any)?.success && (response as any)?.data) {
            let lista = (response as any).data as any[];
            if (this.fechaInicio && this.fechaFin) {
              lista = lista.filter((v: any) => {
                const fecha = new Date(v.FECHA).toISOString().split('T')[0];
                return fecha >= this.fechaInicio && fecha <= this.fechaFin;
              });
            }
            this.ventas.set(lista as any);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (this.fechaInicio && this.fechaFin) {
      this.ventaService.getVentasByFecha(this.fechaInicio, this.fechaFin).subscribe({
        next: (response) => {
          if ((response as any)?.success && (response as any)?.data) {
            this.ventas.set((response as any).data);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.cargarVentas();
    }
  }

  limpiarFiltros(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.empleadoSeleccionado = 0;
    this.cargarVentas();
  }

  // Modal: búsqueda y carrito
  buscarProducto(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.productosFiltrados.set(this.productos());
      return;
    }
    this.productosFiltrados.set(
      this.productos().filter((p: any) =>
        (p.NOMBRE || '').toLowerCase().includes(term) ||
        (p.DESCRIPCION || '').toLowerCase().includes(term) ||
        (p.CATEGORIA || '').toLowerCase().includes(term)
      )
    );
  }

  agregarAlCarrito(producto: any): void {
    if (producto.CANTIDAD_SUCURSAL !== undefined && producto.CANTIDAD_SUCURSAL <= 0) {
      alert('Sin stock en sucursal para este producto');
      return;
    }
    const existente = this.carrito().find(it => it.ID === producto.ID);
    if (existente) {
      const max = producto.CANTIDAD_SUCURSAL ?? Infinity;
      if (existente.cantidad + 1 > max) {
        alert('No hay más stock disponible en sucursal para este producto');
        return;
      }
      this.carrito.set(
        this.carrito().map(it => it.ID === producto.ID
          ? { ...it, cantidad: it.cantidad + 1, subtotal: (it.cantidad + 1) * it.PRECIO }
          : it)
      );
    } else {
      const max = producto.CANTIDAD_SUCURSAL ?? Infinity;
      if (max <= 0) {
        alert('Sin stock en sucursal para este producto');
        return;
      }
      this.carrito.set([
        ...this.carrito(),
        { ...producto, cantidad: 1, subtotal: producto.PRECIO }
      ]);
    }
    this.calcularTotal();
    this.searchTerm = '';
    this.productosFiltrados.set(this.productos());
  }

  cambiarCantidad(productoId: number, cambio: number): void {
    this.carrito.set(
      this.carrito().map(it => {
        if (it.ID !== productoId) return it;
        const nuevaCantidad = Math.max(1, it.cantidad + cambio);
        const max = it.CANTIDAD_SUCURSAL ?? Infinity;
        if (nuevaCantidad > max) {
          alert('No hay más stock disponible en sucursal para este producto');
          return { ...it, cantidad: max, subtotal: max * it.PRECIO };
        }
        return { ...it, cantidad: nuevaCantidad, subtotal: nuevaCantidad * it.PRECIO };
      })
    );
    this.calcularTotal();
  }

  eliminarDelCarrito(productoId: number): void {
    this.carrito.set(this.carrito().filter(it => it.ID !== productoId));
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total.set(this.carrito().reduce((acc, it) => acc + (Number(it.subtotal) || 0), 0));
  }

  finalizarVenta(): void {
    if (this.carrito().length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }
    const numeroVenta = `V-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const ventasPromesas = this.carrito().map(item => {
      const venta = { id_producto: item.ID, cantidad: item.cantidad, precio_unitario: item.PRECIO, numero_venta: numeroVenta };
      return this.ventaService.createVenta(venta).toPromise();
    });
    Promise.all(ventasPromesas)
      .then(() => {
        alert('Venta realizada exitosamente');
        this.cerrarModal();
        if (this.authService.isAdmin()) this.cargarVentas(); else this.verificarCajaYAbrirDatos();
      })
      .catch((error) => alert('Error al realizar la venta: ' + (error?.error?.message || error.message)));
  }

  cerrarModal(): void {
    this.showModal.set(false);
    this.carrito.set([]);
    this.total.set(0);
    this.searchTerm = '';
    this.productosFiltrados.set(this.productos());
  }

  abrirModal(): void {
    this.showModal.set(true);
    this.carrito.set([]);
    this.total.set(0);
    this.searchTerm = '';
    this.productosFiltrados.set(this.productos());
  }

  abrirCaja(): void {
    this.cierreCajaService.abrirCaja().subscribe({
      next: (resp: any) => {
        if (resp?.success) this.verificarCajaYAbrirDatos(); else alert(resp?.message || 'No se pudo abrir la caja');
      },
      error: (e) => alert(e?.error?.message || e.message || 'Error al abrir la caja')
    });
  }
}
