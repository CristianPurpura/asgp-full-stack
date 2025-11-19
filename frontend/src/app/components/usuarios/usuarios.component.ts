import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { LayoutComponent } from '../shared/layout';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LayoutComponent],
  styles: [`
    .top-bar {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Estilos específicos del componente - las clases globales se usan desde styles.css */

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    /* Los estilos de botones ya están en estilos globales */

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    /* Las clases globales de table ya están definidas en styles.css */

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .badge-success {
      background: rgba(76,175,80,0.2);
      color: #4caf50;
      border: 1px solid rgba(76,175,80,0.5);
    }

    .badge-danger {
      background: rgba(211,47,47,0.2);
      color: #f44336;
      border: 1px solid rgba(211,47,47,0.5);
    }

    .badge-primary {
      background: rgba(0,255,255,0.2);
      color: #0ff;
      border: 1px solid rgba(0,255,255,0.5);
    }

    .badge-secondary {
      background: rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.7);
      border: 1px solid rgba(255,255,255,0.3);
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      padding: 0.4rem 0.8rem;
      font-size: 0.875rem;
    }

    /* Modal overlay y form-group ya están en estilos globales */
    
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: rgba(255,255,255,0.9);
    }

    .form-control {
      width: 100%;
      padding: 0.625rem;
      border: 1px solid rgba(0,255,255,0.3);
      border-radius: 6px;
      font-size: 1rem;
      background: rgba(0,0,0,0.3);
      color: white;
    }

    .form-control:focus {
      outline: none;
      border-color: #0ff;
      box-shadow: 0 0 10px rgba(0,255,255,0.3);
    }

    /* Los estilos de loading/spinner ya están en estilos globales */
  `],
  template: `
    <app-layout>
      <div class="page-header">
        <h2>👥 Usuarios</h2>
        <button class="btn btn-primary" (click)="openCreateModal()">+ Crear Nuevo Usuario</button>
      </div>

      <div class="content-wrapper">
        <div class="content-card">
          @if (loading()) {
            <div class="loading">
              <div class="spinner"></div>
              <p>Cargando usuarios...</p>
            </div>
          } @else if (usuarios().length === 0) {
            <div class="loading">
              <p style="font-size: 1.125rem; margin-bottom: 0.5rem; color: rgba(255, 255, 255, 0.8);">No hay usuarios registrados</p>
              <p style="color: rgba(255, 255, 255, 0.5);">Comienza creando tu primer usuario</p>
            </div>
          } @else {
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (usuario of usuarios(); track usuario.ID_USUARIO) {
                  <tr>
                    <td>{{ usuario.ID_USUARIO }}</td>
                    <td>{{ usuario.NOMBRE }} {{ usuario.APELLIDO }}</td>
                    <td>{{ usuario.EMAIL }}</td>
                    <td>
                      <span class="badge" [class.badge-primary]="usuario.ROL === 'ADMIN'" 
                            [class.badge-secondary]="usuario.ROL === 'EMPLEADO'">
                        {{ usuario.ROL }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" [class.badge-success]="usuario.ACTIVO" 
                            [class.badge-danger]="!usuario.ACTIVO">
                        {{ usuario.ACTIVO ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td>{{ usuario.FECHA_CREACION | date: 'dd/MM/yyyy' }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn btn-secondary btn-icon" (click)="editUsuario(usuario)">
                          ✏️
                        </button>
                        <button class="btn btn-danger btn-icon" (click)="deleteUsuario(usuario)">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    </app-layout>

    <!-- Modal Crear/Editar Usuario -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">{{ isEditMode() ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</h3>
            <button class="modal-close" (click)="closeModal()">×</button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" [(ngModel)]="formData.NOMBRE" 
                       name="nombre" placeholder="Ingrese el nombre">
              </div>
              <div class="form-group">
                <label class="form-label">Apellido</label>
                <input type="text" class="form-control" [(ngModel)]="formData.APELLIDO" 
                       name="apellido" placeholder="Ingrese el apellido">
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" [(ngModel)]="formData.EMAIL" 
                       name="email" placeholder="usuario@ejemplo.com">
              </div>
              @if (!isEditMode()) {
                <div class="form-group">
                  <label class="form-label">Contraseña</label>
                  <input type="password" class="form-control" [(ngModel)]="formData.PASSWORD" 
                         name="password" placeholder="Ingrese la contraseña">
                </div>
              }
              <div class="form-group">
                <label class="form-label">Rol</label>
                <select class="form-control" [(ngModel)]="formData.ROL" name="rol">
                  <option value="ADMIN">ADMIN</option>
                  <option value="EMPLEADO">EMPLEADO</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select class="form-control" [(ngModel)]="formData.ACTIVO" name="activo">
                  <option [value]="true">Activo</option>
                  <option [value]="false">Inactivo</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
            <button class="btn btn-primary" (click)="saveUsuario()">
              {{ isEditMode() ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class UsuariosComponent implements OnInit {
  usuarios = signal<Usuario[]>([]);
  loading = signal(true);
  showModal = signal(false);
  isEditMode = signal(false);
  
  formData: any = {
    NOMBRE: '',
    APELLIDO: '',
    EMAIL: '',
    PASSWORD: '',
    ROL: 'EMPLEADO',
    ACTIVO: true
  };

  constructor(
    public authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading.set(true);
    this.usuarioService.getUsuarios().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.usuarios.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.formData = {
      NOMBRE: '',
      APELLIDO: '',
      EMAIL: '',
      PASSWORD: '',
      ROL: 'EMPLEADO',
      ACTIVO: true
    };
    this.showModal.set(true);
  }

  editUsuario(usuario: Usuario): void {
    this.isEditMode.set(true);
    this.formData = {
      ID_USUARIO: usuario.ID_USUARIO,
      NOMBRE: usuario.NOMBRE,
      APELLIDO: usuario.APELLIDO,
      EMAIL: usuario.EMAIL,
      ROL: usuario.ROL,
      ACTIVO: usuario.ACTIVO
    };
    this.showModal.set(true);
  }

  saveUsuario(): void {
    if (this.isEditMode()) {
      // Actualizar usuario
      this.usuarioService.updateUsuario(this.formData.ID_USUARIO, this.formData).subscribe({
        next: () => {
          alert('Usuario actualizado exitosamente');
          this.loadUsuarios();
          this.closeModal();
        },
        error: (err) => {
          alert(err.error?.message || 'Error al actualizar usuario');
        }
      });
    } else {
      // Crear usuario
      this.usuarioService.createUsuario(this.formData).subscribe({
        next: () => {
          alert('Usuario creado exitosamente');
          this.loadUsuarios();
          this.closeModal();
        },
        error: (err) => {
          alert(err.error?.message || 'Error al crear usuario');
        }
      });
    }
  }

  deleteUsuario(usuario: Usuario): void {
    if (confirm(`¿Está seguro de eliminar al usuario ${usuario.NOMBRE} ${usuario.APELLIDO}?`)) {
      this.usuarioService.deleteUsuario(usuario.ID_USUARIO).subscribe({
        next: () => {
          alert('Usuario eliminado exitosamente');
          this.loadUsuarios();
        },
        error: (err) => {
          alert(err.error?.message || 'Error al eliminar usuario');
        }
      });
    }
  }

  closeModal(): void {
    this.showModal.set(false);
  }
}
