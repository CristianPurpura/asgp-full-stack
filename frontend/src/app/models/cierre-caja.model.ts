export interface CierreCaja {
  ID: number;
  ID_EMPLEADO: number;
  NOMBRE_EMPLEADO: string;
  FECHA_APERTURA: string;
  FECHA_CIERRE: string | null;
  MONTO_FINAL: number | null;
}

export interface CajaActual {
  cierre: CierreCaja;
  ventas: {
    total_transacciones: number;
    total_vendido: number;
  };
}

export interface CerrarCajaRequest {
  monto_final: number;
}
