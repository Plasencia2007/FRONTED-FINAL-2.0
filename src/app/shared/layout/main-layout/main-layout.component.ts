import { Component, inject } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar.component";
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, NavbarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
private auth = inject(AuthService);
  private router = inject(Router);
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
