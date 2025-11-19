import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirigir si ya está autenticado
    if (this.authService.isAuthenticated()) {
      const rol = this.authService.currentUser()?.rol;
      if (rol === 'ADMIN') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/ventas']);
      }
    }
  }

  loginCognito(): void {
    this.authService.loginWithCognito();
  }
}
