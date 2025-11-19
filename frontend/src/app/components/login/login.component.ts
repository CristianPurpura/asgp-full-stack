import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = signal<string>('');
  loading = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

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
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');
      
      const credentials = {
        mail: this.loginForm.value.email,
        contraseña: this.loginForm.value.password
      };
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response.success) {
            const rol = this.authService.currentUser()?.rol;
            if (rol === 'ADMIN') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/ventas']);
            }
          }
        },
        error: (error) => {
          this.loading.set(false);
          this.errorMessage.set(error.error?.message || 'Error al iniciar sesión');
        }
      });
    }
  }

  loginCognito(): void {
    this.authService.loginWithCognito();
  }
}
