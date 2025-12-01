// src/app/core/models/entrega.model.ts
export interface Entrega {
  idEntrega?: number;
  tipoRuta?: string;
  fechaProgramacion: Date;
  fechaFin?: Date | null;
  montoBase: number;
  montoGastos: number;
  montoTotal: number;

  // Solo IDs (como viene del backend)
  idVehiculo: number;
  idChofer: number;
  idCliente: number;
  idEstado: number;
}