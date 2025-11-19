import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CierreCajaService } from '../../services/cierre-caja.service';
import { VentaService } from '../../services/venta.service';
import { AuthService } from '../../services/auth.service';
import { LayoutComponent } from '../shared/layout';

@Component({
  selector: 'app-cierre-caja',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="page-header">
  <h2>Cierres de caja</h2>
      </div>

      <div class="content-wrapper">
        <div class="content-card">
        
        @if (!authService.isAdmin()) {
          <!-- Vista EMPLEADO: Operaciones de caja -->
          @if (cajaActual()) {
            <div style="background: rgba(76,175,80,0.1); border: 1px solid rgba(76,175,80,0.5); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
              <h3 style="margin: 0 0 1rem 0; color: #4caf50; font-size: 1.25rem; text-shadow: 0 0 10px rgba(76,175,80,0.5);">Caja Abierta</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 6px; border: 1px solid rgba(0,255,255,0.3);">
                  <div style="font-size: 0.75rem; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 0.25rem;">Fecha Apertura</div>
                  <div style="font-size: 1rem; font-weight: 500; color: white;">{{ toLocalDate(cajaActual().cierre.FECHA_APERTURA) | date: 'short' }}</div>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 6px; border: 1px solid rgba(0,255,255,0.3);">
                  <div style="font-size: 0.75rem; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 0.25rem;">Total Vendido</div>
                  <div style="font-size: 1.25rem; font-weight: 600; color: #4caf50; text-shadow: 0 0 10px rgba(76,175,80,0.5);">\${{ cajaActual().ventas.total_vendido || 0 }}</div>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 6px; border: 1px solid rgba(0,255,255,0.3);">
                  <div style="font-size: 0.75rem; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 0.25rem;">Transacciones</div>
                  <div style="font-size: 1.25rem; font-weight: 600; color: #0ff; text-shadow: 0 0 10px rgba(0,255,255,0.5);">{{ cajaActual().ventas.total_transacciones || 0 }}</div>
                </div>
              </div>
              <button (click)="mostrarModalCerrar()" class="btn btn-danger">Cerrar Caja</button>
            </div>
          } @else {
            <div style="background: rgba(255,193,7,0.1); border: 1px solid rgba(255,193,7,0.5); border-radius: 8px; padding: 2rem; text-align: center;">
              <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; color: white;">No hay caja abierta</h3>
              <p style="color: rgba(255,255,255,0.7); margin: 0 0 1.5rem 0;">Debe abrir caja para comenzar a registrar ventas</p>
              <button (click)="abrirCaja()" class="btn btn-success">Abrir Caja</button>
            </div>
          }
        } @else {
          <!-- Vista ADMIN: Historial de cierres -->
          <div style="margin-top: 1rem;">
            <h3 style="margin-bottom: 1rem; color: #0ff; text-shadow: 0 0 10px rgba(0,255,255,0.5);">Historial de Cierres de Caja</h3>
            
            @if (loadingHistorial()) {
              <div class="loading"><div class="spinner"></div></div>
            } @else {
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Empleado</th>
                    <th>Fecha Apertura</th>
                    <th>Fecha Cierre</th>
                    <th>Monto Final</th>
                    <th>Estado</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  @for (cierre of historialCierres(); track cierre.ID_CIERRE) {
                    <tr>
                      <td>{{ getCierreId(cierre) }}</td>
                      <td>{{ cierre.NOMBRE_EMPLEADO }}</td>
                      <td>{{ toLocalDate(cierre.FECHA_APERTURA) | date: 'short' }}</td>
                      <td>{{ cierre.FECHA_CIERRE ? (toLocalDate(cierre.FECHA_CIERRE) | date: 'short') : 'Abierta' }}</td>
                      <td>{{ cierre.MONTO_FINAL ? ('\$' + cierre.MONTO_FINAL) : '-' }}</td>
                      <td>
                        @if (cierre.FECHA_CIERRE) {
                          <span style="color: green;">Cerrada</span>
                        } @else {
                          <span style="color: orange;">Abierta</span>
                        }
                      </td>
                      <td>
                        <button (click)="toggleCierre(cierre)" style="padding: 0.25rem 0.5rem; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">{{ cierreExpandido(getCierreId(cierre)) ? 'Ocultar' : 'Ver ventas' }}</button>
                      </td>
                    </tr>
                    @if (cierreExpandido(getCierreId(cierre))) {
                      <tr>
                        <td colspan="7" style="background: #fafafa; padding: 1rem 1rem 0.5rem 1rem;">
                          @if (isLoadingVentas(getCierreId(cierre))) {
                            <div style="padding: 1rem; color: #666;">Cargando ventas...</div>
                          } @else {
                            @if (!ventasDeCierre(getCierreId(cierre)).grupos.length) {
                              <div style="padding: 1rem; color: #666;">No hay ventas registradas en este cierre.</div>
                            } @else {
                              <div style="margin-bottom: 0.5rem; text-align:right; font-weight:600;">Total del cierre: \${{ ventasDeCierre(getCierreId(cierre)).total | number:'1.2-2' }}</div>
                              <div>
                                @for (grupo of ventasDeCierre(getCierreId(cierre))!.grupos; track grupo.id) {
                                  <div style="border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 0.5rem; overflow: hidden;">
                                    <div (click)="toggleGrupoCierre(getCierreId(cierre), grupo.id)" style="cursor: pointer; background: #f9f9f9; padding: 0.5rem 0.75rem; display:flex; justify-content: space-between; align-items: center;">
                                      <div>
                                        <div style="font-weight:600;">Venta</div>
                                        <div style="color:#777; font-size: 0.8rem;">{{ grupo.fecha | date:'HH:mm' }} • {{ grupo.items.length }} ítem(s)</div>
                                      </div>
                                      <div style="font-weight:600;">\${{ grupo.total | number:'1.2-2' }}</div>
                                    </div>
                                    @if (grupoExpandidoCierre(getCierreId(cierre), grupo.id)) {
                                      <table style="width: 100%; border-collapse: collapse;">
                                        <thead>
                                          <tr style="background:#fff;">
                                            <th style="text-align:left; padding: 0.5rem 0.75rem; color:#666; font-size: 0.8rem;">Producto</th>
                                            <th style="text-align:center; padding: 0.5rem 0.75rem; color:#666; font-size: 0.8rem;">Cantidad</th>
                                            <th style="text-align:right; padding: 0.5rem 0.75rem; color:#666; font-size: 0.8rem;">Precio</th>
                                            <th style="text-align:right; padding: 0.5rem 0.75rem; color:#666; font-size: 0.8rem;">Subtotal</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          @for (item of grupo.items; track item.ID) {
                                            <tr style="border-top: 1px solid #eee;">
                                              <td style="padding: 0.5rem 0.75rem;">{{ item.NOMBRE_PRODUCTO }}</td>
                                              <td style="padding: 0.5rem 0.75rem; text-align:center;">{{ item.CANTIDAD }}</td>
                                              <td style="padding: 0.5rem 0.75rem; text-align:right;">\${{ item.PRECIO_UNITARIO | number:'1.2-2' }}</td>
                                              <td style="padding: 0.5rem 0.75rem; text-align:right; font-weight:500;">\${{ item.TOTAL | number:'1.2-2' }}</td>
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
                        </td>
                      </tr>
                    }
                  }
                  @empty {
                    <tr>
                      <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                        No hay cierres de caja registrados
                      </td>
                    </tr>
                  }
                </tbody>
                </table>
              }
            </div>
          }
        </div>
      </div>

      <!-- Modal para cerrar caja -->
      @if (showModalCerrar()) {
        <div class="modal-overlay" (click)="cancelarCierre()" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
          <div class="modal-content" (click)="$event.stopPropagation()" style="background: white; border-radius: 8px; width: 90%; max-width: 500px; padding: 0;">
            <div style="padding: 1.5rem; border-bottom: 1px solid #e0e0e0;">
              <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600;">Cerrar Caja</h3>
            </div>
            
            <div style="padding: 1.5rem;">
              <div style="background: #f5f5f5; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                  <span style="color: #666;">Total vendido:</span>
                  <span style="font-weight: 600;">\${{ cajaActual().ventas.total_vendido || 0 }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Transacciones:</span>
                  <span style="font-weight: 600;">{{ cajaActual().ventas.total_transacciones || 0 }}</span>
                </div>
              </div>

              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #333;">Monto Final en Caja</label>
                <input 
                  type="number" 
                  [(ngModel)]="montoFinal" 
                  placeholder="Ingrese el monto final..."
                  min="0"
                  step="0.01"
                  style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;"
                />
                <div style="font-size: 0.75rem; color: #666; margin-top: 0.5rem;">
                  Ingrese el monto físico que hay en la caja
                </div>
              </div>

              <div style="display: flex; gap: 0.75rem;">
                <button 
                  (click)="confirmarCierre()" 
                  [disabled]="montoFinal === null || montoFinal === undefined || montoFinal < 0"
                  style="flex: 1; padding: 0.75rem; background: #d32f2f; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; font-size: 0.9375rem;"
                  [style.opacity]="montoFinal === null || montoFinal === undefined || montoFinal < 0 ? '0.5' : '1'"
                  [style.cursor]="montoFinal === null || montoFinal === undefined || montoFinal < 0 ? 'not-allowed' : 'pointer'">
                  Cerrar Caja
                </button>
                <button 
                  (click)="cancelarCierre()" 
                  style="flex: 1; padding: 0.75rem; background: white; color: #333; border: 1px solid #ddd; border-radius: 6px; font-weight: 500; cursor: pointer; font-size: 0.9375rem;">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </app-layout>
  `
})
export class CierreCajaComponent implements OnInit {
  cajaActual = signal<any>(null);
  historialCierres = signal<any[]>([]);
  loadingHistorial = signal(false);
  showModalCerrar = signal(false);
  montoFinal: number | null = null;
  // Estado de expansión y ventas por cierre
  private cierresExpandidos = new Set<number>();
  private ventasPorCierre = signal<Record<number, { grupos: any[]; total: number }>>({});
  private loadingVentasPorCierre = signal<Record<number, boolean>>({});
  private gruposExpandidosPorCierre = new Set<string>();

  constructor(
    public authService: AuthService,
  private cierreCajaService: CierreCajaService,
  private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      // ADMIN: cargar historial de cierres
      this.cargarHistorial();
    } else {
      // EMPLEADO: cargar caja actual
      this.cargarCajaActual();
    }
  }

  cargarCajaActual(): void {
    this.cierreCajaService.getCajaActual().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.cajaActual.set(response.data);
        }
      }
    });
  }

  cargarHistorial(): void {
    this.loadingHistorial.set(true);
    this.cierreCajaService.getCierresCaja().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Normalizar fechas a local
          const normalizados = response.data.map((c: any) => ({
            ...c,
            FECHA_APERTURA: this.toLocalDate(c.FECHA_APERTURA),
            FECHA_CIERRE: c.FECHA_CIERRE ? this.toLocalDate(c.FECHA_CIERRE) : null
          }));
          this.historialCierres.set(normalizados);
        }
        this.loadingHistorial.set(false);
      },
      error: () => this.loadingHistorial.set(false)
    });
  }

  abrirCaja(): void {
    if (confirm('¿Está seguro de abrir la caja?')) {
      this.cierreCajaService.abrirCaja().subscribe({
        next: () => {
          alert('Caja abierta exitosamente. Ya puede comenzar a registrar ventas.');
          this.cargarCajaActual();
        },
        error: (err) => {
          alert(err.error?.message || 'Error al abrir caja');
        }
      });
    }
  }

  mostrarModalCerrar(): void {
    this.montoFinal = this.cajaActual()?.ventas.total_vendido || 0;
    this.showModalCerrar.set(true);
  }

  cancelarCierre(): void {
    this.showModalCerrar.set(false);
    this.montoFinal = null;
  }

  confirmarCierre(): void {
    if (this.montoFinal === null || this.montoFinal === undefined || this.montoFinal < 0) {
      alert('Debe ingresar un monto válido (mayor o igual a 0)');
      return;
    }

    this.cierreCajaService.cerrarCaja({ monto_final: this.montoFinal }).subscribe({
      next: () => {
        alert('Caja cerrada exitosamente');
        this.showModalCerrar.set(false);
        this.montoFinal = null;
        this.cajaActual.set(null);
        // refrescar historial si es admin
        if (this.authService.isAdmin()) this.cargarHistorial();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al cerrar caja');
      }
    });
  }

  // Utils de fechas y ids
  toLocalDate(fecha: string | Date): Date {
    if (fecha instanceof Date) return fecha;
    const s = String(fecha || '');
    if (!s) return new Date();
    return new Date(s.endsWith('Z') ? s.replace('Z', '') : s);
  }

  getCierreId(c: any): number { return c?.ID_CIERRE ?? c?.ID; }
  getEmpleadoId(c: any): number { return c?.ID_EMPLEADO ?? c?.ID_USUARIO; }

  // Expansión de cierre y carga de ventas
  cierreExpandido(id: number): boolean { return this.cierresExpandidos.has(id); }
  isLoadingVentas(id: number): boolean { return !!this.loadingVentasPorCierre()[id]; }
  ventasDeCierre(id: number) { return this.ventasPorCierre()[id]; }

  toggleCierre(cierre: any): void {
    const id = this.getCierreId(cierre);
    if (this.cierresExpandidos.has(id)) {
      this.cierresExpandidos.delete(id);
      return;
    }
    this.cierresExpandidos.add(id);
    if (!this.ventasPorCierre()[id]) {
      this.cargarVentasParaCierre(cierre);
    }
  }

  private cargarVentasParaCierre(cierre: any): void {
    const id = this.getCierreId(cierre);
    const idEmpleado = this.getEmpleadoId(cierre);
    const inicio = this.toLocalDate(cierre.FECHA_APERTURA);
    const fin = cierre.FECHA_CIERRE ? this.toLocalDate(cierre.FECHA_CIERRE) : new Date();
    // marcar loading
    this.loadingVentasPorCierre.set({ ...this.loadingVentasPorCierre(), [id]: true });
    this.ventaService.getVentasByUsuario(idEmpleado).subscribe({
      next: (resp: any) => {
        let ventas = Array.isArray(resp?.data) ? resp.data : [];
        // filtrar por rango
        ventas = ventas.filter((v: any) => {
          const f = this.toLocalDate(v.FECHA);
          return f >= inicio && f <= fin;
        });
        const grupos = this.agruparVentas(ventas);
        const total = ventas.reduce((acc: number, it: any) => acc + (Number(it.TOTAL) || 0), 0);
        this.ventasPorCierre.set({ ...this.ventasPorCierre(), [id]: { grupos, total } });
        this.loadingVentasPorCierre.set({ ...this.loadingVentasPorCierre(), [id]: false });
      },
      error: () => {
        this.ventasPorCierre.set({ ...this.ventasPorCierre(), [id]: { grupos: [], total: 0 } });
        this.loadingVentasPorCierre.set({ ...this.loadingVentasPorCierre(), [id]: false });
      }
    });
  }

  private agruparVentas(ventas: any[]): Array<{ id: string; fecha: Date; items: any[]; total: number }> {
    const map = new Map<string, { id: string; fecha: Date; items: any[]; total: number }>();
    for (const v of ventas) {
      const grupoId = v.NUMERO_VENTA || this.formatearGrupoPorFecha(v.FECHA);
      const fecha = this.toLocalDate(v.FECHA);
      if (!map.has(grupoId)) {
        map.set(grupoId, { id: grupoId, fecha, items: [], total: 0 });
      }
      const g = map.get(grupoId)!;
      g.items.push(v);
      g.total += Number(v.TOTAL) || 0;
      if (fecha > g.fecha) g.fecha = fecha;
    }
    return Array.from(map.values()).sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
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

  grupoExpandidoCierre(cierreId: number, grupoId: string): boolean {
    return this.gruposExpandidosPorCierre.has(`${cierreId}|${grupoId}`);
  }
  toggleGrupoCierre(cierreId: number, grupoId: string): void {
    const key = `${cierreId}|${grupoId}`;
    if (this.gruposExpandidosPorCierre.has(key)) this.gruposExpandidosPorCierre.delete(key); else this.gruposExpandidosPorCierre.add(key);
  }
}
