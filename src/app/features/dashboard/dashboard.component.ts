// src/app/features/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { EntregaListComponent } from '../../pages/entregas/entrega-list/entrega-list.component'; // ← Importa el componente

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [EntregaListComponent] // ← Agrega el componente aquí
})
export class DashboardComponent {
  // Puedes agregar lógica adicional si necesitas
}