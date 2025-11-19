import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { empleadoOnlyGuard } from './guards/empleado-only.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'auth/callback', loadComponent: () => import('./components/login/oauth-callback.component').then(m => m.AuthCallbackComponent) },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'dashboard', 
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'productos', 
    canActivate: [authGuard],
    loadComponent: () => import('./components/productos/productos.component').then(m => m.ProductosComponent)
  },
  { 
    path: 'stock', 
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/stock/stock.component').then(m => m.StockComponent)
  },
  { 
    path: 'ventas', 
    canActivate: [authGuard],
    loadComponent: () => import('./components/ventas/ventas.component').then(m => m.VentasComponent)
  },
  { 
    path: 'cierre-caja', 
    canActivate: [authGuard],
    loadComponent: () => import('./components/cierre-caja/cierre-caja.component').then(m => m.CierreCajaComponent)
  },
  { 
    path: 'usuarios', 
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/usuarios/usuarios.component').then(m => m.UsuariosComponent)
  },
  { path: '**', redirectTo: '/ventas' }
];
