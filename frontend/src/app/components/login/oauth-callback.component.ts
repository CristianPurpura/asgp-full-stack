import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="p-4 text-center">Procesando autenticación...<br/>Serás redirigido automáticamente.</div>`
})
export class AuthCallbackComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.auth.handleCognitoCallback();
    const user = this.auth.currentUser();
    if (user?.rol === 'ADMIN') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/ventas']);
    }
  }
}
