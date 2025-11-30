import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IncidenciaService } from '../../../core/services/incidencia.service';
import { Incidencia } from '../../../core/models/incidencia.model';
import { DatePipe, NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-incidencia-detail',
  templateUrl: './incidencia-detail.component.html',
  styleUrls: ['./incidencia-detail.component.css'],
  standalone: true,
  imports: [NgIf, NgClass]
})
export class IncidenciaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private incidenciaService = inject(IncidenciaService);

  incidencia: Incidencia | null = null;
  fechaCarga = new Date();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.incidenciaService.getIncidenciaById(+id).subscribe({
        next: (data) => {
          this.incidencia = data;
        },
        error: () => {
          alert('No se pudo cargar la incidencia.');
          this.router.navigate(['/incidencias']);
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/incidencias']);
  }
  getPrioridadClass(prioridad: string | undefined): string {
  if (!prioridad) return 'bg-secondary';

  switch (prioridad) {
    case 'BAJA':
      return 'bg-success';
    case 'MEDIA':
      return 'bg-warning text-dark';
    case 'ALTA':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
}
}