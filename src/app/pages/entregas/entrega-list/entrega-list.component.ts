// src/app/pages/entregas/entrega-list/entrega-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entrega } from '../../../core/models/entrega.model';
import { EntregaService } from '../../../core/services/entrega.service';
import { ChoferService } from '../../../core/services/chofer.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { EstadoService } from '../../../core/services/estado.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-entrega-list',
  templateUrl: './entrega-list.component.html',
  styleUrls: ['./entrega-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EntregaListComponent implements OnInit {
  entregas: Entrega[] = [];
  choferes: { id: number; nombres: string }[] = [];
  clientes: { id: number; razonSocial: string }[] = [];
  estados: { id: number; descripcion: string }[] = [];

  loading = false;
  error: string | null = null;

  // ✅ Filtro por tipo de ruta
  filtroTipoRuta: string = 'todos';
  tiposRutaUnicos: string[] = [];

  constructor(
    private entregaService: EntregaService,
    private choferService: ChoferService,
    private clienteService: ClienteService,
    private estadoService: EstadoService
  ) {}

  ngOnInit(): void {
    this.loadMaestros();
    this.loadEntregas();
  }

  private loadMaestros(): void {
    this.choferService.getChoferes().subscribe({
      next: (data) => this.choferes = data,
      error: (err) => console.error('Error al cargar choferes:', err)
    });

    this.clienteService.getClientes().subscribe({
      next: (data) => this.clientes = data,
      error: (err) => console.error('Error al cargar clientes:', err)
    });

    this.estadoService.getEstados().subscribe({
      next: (data) => this.estados = data,
      error: (err) => console.error('Error al cargar estados:', err)
    });
  }

  private loadEntregas(): void {
    this.loading = true;
    this.error = null;
    this.entregaService.getEntregas().subscribe({
      next: (data) => {
        this.entregas = data.map(e => ({
          ...e,
          fechaProgramacion: new Date(e.fechaProgramacion),
          fechaFin: e.fechaFin ? new Date(e.fechaFin) : null
        }));
        // ✅ Extraer tipos de ruta únicos para el filtro
        this.tiposRutaUnicos = [...new Set(
          this.entregas
            .map(e => e.tipoRuta)
            .filter(ruta => ruta !== null && ruta !== undefined) as string[]
        )];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar entregas:', err);
        this.error = 'No se pudieron cargar las entregas. Verifica tu conexión o permisos.';
        this.loading = false;
      }
    });
  }

  getChoferNombre(id: number): string {
    const chofer = this.choferes.find(c => c.id === id);
    return chofer?.nombres || `Chofer #${id}`;
  }

  getClienteRazonSocial(id: number): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente?.razonSocial || `Cliente #${id}`;
  }

  getEstadoDescripcion(id: number): string {
    const estado = this.estados.find(e => e.id === id);
    return estado?.descripcion || `Estado #${id}`;
  }

  // ✅ Método para filtrar las entregas
  get entregasFiltradas(): Entrega[] {
    if (this.filtroTipoRuta === 'todos') {
      return this.entregas;
    }
    return this.entregas.filter(e => e.tipoRuta === this.filtroTipoRuta);
  }
}