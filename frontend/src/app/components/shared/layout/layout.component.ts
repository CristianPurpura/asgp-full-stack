import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="layout-container">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1 class="brand neon-title" style="font-size: 1.2em;"> Full 7x24</h1>
        </div>

        <nav class="sidebar-nav">
          <p class="nav-label">MENÚ</p>
          
          @if (isAdmin) {
            <div class="nav-item" 
                 [class.active]="currentRoute === '/dashboard'"
                 (click)="goTo('/dashboard')">
              Panel
            </div>
          }
          
          @if (!isAdmin) {
            <div class="nav-item" 
                 [class.active]="currentRoute === '/ventas'"
                 (click)="goTo('/ventas')">
              Ventas
            </div>
          }
          
          <div class="nav-item" 
               [class.active]="currentRoute === '/productos'"
               (click)="goTo('/productos')">
            Productos
          </div>
          
          @if (!isAdmin) {
            <div class="nav-item" 
                 [class.active]="currentRoute === '/cierre-caja'"
                 (click)="goTo('/cierre-caja')">
              Cierre de caja
            </div>
          }
          
          @if (isAdmin) {
            <div class="nav-item" 
                 [class.active]="currentRoute === '/stock'"
                 (click)="goTo('/stock')">
              Gestión de stock
            </div>
            
            <div class="nav-item" 
                 [class.active]="currentRoute === '/ventas'"
                 (click)="goTo('/ventas')">
              Ventas
            </div>
            
            <div class="nav-item" 
                 [class.active]="currentRoute === '/cierre-caja'"
                 (click)="goTo('/cierre-caja')">
              Cierres de caja
            </div>
            
            <div class="nav-item" 
                 [class.active]="currentRoute === '/usuarios'"
                 (click)="goTo('/usuarios')">
              Usuarios
            </div>
          }
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="avatar">{{ userInitials }}</div>
            <div class="user-details">
              <div class="user-name">{{ userName }}</div>
              <div class="user-role">{{ userRole }}</div>
            </div>
          </div>
          <button class="logout-button" (click)="onLogout()">Cerrar sesión</button>
        </div>
      </aside>

      <main class="main-content">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .layout-container {
      position: relative;
      width: 100%;
      min-height: 100vh;
      background-image: url('/assets/img/4975900.jpg');
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }

    .layout-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 0;
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 240px;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.8);
      border-right: 1px solid rgba(0, 255, 255, 0.3);
      z-index: 1000;
      display: grid;
      grid-template-rows: auto 1fr auto;
      grid-template-columns: 240px;
      backdrop-filter: blur(10px);
    }

    .sidebar-header {
      grid-row: 1;
      padding: 24px 16px;
      border-bottom: 1px solid rgba(0, 255, 255, 0.3);
    }

    .brand {
      font-size: 20px;
      font-weight: 600;
      color: #ec05c1;
      text-shadow: 0 0 10px #ec05c1;
    }

    .sidebar-nav {
      grid-row: 2;
      padding: 16px 12px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      margin: 0 0 8px 12px;
      letter-spacing: 0.5px;
    }

    .nav-item {
      display: block;
      width: 100%;
      padding: 12px 16px;
      margin: 0 0 4px 0;
      border-radius: 6px;
      background: transparent;
      border: 1px solid transparent;
      text-align: left;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-family: inherit;
      user-select: none;
      outline: none;
      transition: all 0.3s ease;
    }

    .nav-item:hover {
      background-color: rgba(0, 255, 255, 0.1);
      border-color: rgba(0, 255, 255, 0.3);
      color: #0ff;
      text-shadow: 0 0 5px #0ff;
    }

    .nav-item.active {
      background-color: rgba(0, 255, 255, 0.2);
      color: #0ff;
      font-weight: 500;
      border-color: #0ff;
      text-shadow: 0 0 10px #0ff;
    }

    .sidebar-footer {
      grid-row: 3;
      padding: 16px;
      border-top: 1px solid rgba(0, 255, 255, 0.3);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      margin-bottom: 12px;
      color: rgba(255, 255, 255, 0.8);
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgba(0, 255, 255, 0.2);
      color: #0ff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      border: 1px solid #0ff;
      text-shadow: 0 0 5px #0ff;
      flex-shrink: 0;
    }

    .user-details {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 12px;
      color: #666;
    }

    .logout-button {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background-color: white;
      color: #333;
      font-size: 14px;
      font-family: inherit;
      cursor: pointer;
      outline: none;
    }

    .logout-button:hover {
      background-color: #f5f5f5;
    }

    .main-content {
      position: relative;
      margin-left: 240px; /* espacio para la sidebar */
      padding: 24px;
      min-height: 100vh;
      z-index: 1;
    }
  `]
})
export class LayoutComponent implements OnInit, OnDestroy {
  currentRoute: string = '';
  isAdmin: boolean = false;
  userName: string = '';
  userRole: string = '';
  userInitials: string = '';
  
  private routerSubscription?: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateUserInfo();
    this.currentRoute = this.router.url;
    
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateUserInfo(): void {
    const user = this.authService.currentUser();
    this.isAdmin = this.authService.isAdmin();
    
    if (user) {
      this.userName = user.nombre || 'Usuario';
      const rol = user.rol || '';
      this.userRole = rol === 'ADMIN' ? 'Administrador' : (rol === 'EMPLEADO' ? 'Empleado' : rol);
      
      const names = this.userName.split(' ');
      if (names.length > 1) {
        this.userInitials = (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
      } else {
        this.userInitials = this.userName.substring(0, 2).toUpperCase();
      }
    }
  }

  goTo(route: string): void {
    this.router.navigate([route]);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
