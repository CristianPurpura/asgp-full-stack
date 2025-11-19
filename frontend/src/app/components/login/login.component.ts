import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  mail = '';
  password = '';
  error = signal('');
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isAuthenticated()) {
      const rol = this.authService.currentUser()?.rol;
      if (rol === 'ADMIN') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/ventas']);
      }
    }
  }

  onSubmit(): void {
    if (!this.mail || !this.password) {
      this.error.set('Por favor complete todos los campos');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login({ mail: this.mail, contraseña: this.password })
      .subscribe({
        next: (response: any) => {
          if (response?.success) {
            const rol = this.authService.currentUser()?.rol;
            if (rol === 'ADMIN') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/ventas']);
            }
          }
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Error al iniciar sesión');
          this.loading.set(false);
        },
        complete: () => this.loading.set(false)
      });
  }
}
