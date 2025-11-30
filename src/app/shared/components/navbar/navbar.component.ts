import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; // 👈 Importa esto
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, RouterLinkActive] // ✅ Agrega esto
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username: string | null = '';
  role: string | null = '';

  constructor() {
    this.username = this.auth.getUsername();
    this.role = this.auth.getRole();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}