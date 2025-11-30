import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
 authService = inject(AuthService);
  router = inject(Router);  
  username = '';
  password = '';
  errorMessage = '';
  login() {
    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () => this.errorMessage = 'Credenciales incorrectas'
      });
  }
}
