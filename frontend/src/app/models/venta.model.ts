export interface Venta {
  ID: number;
  ID_USUARIO: number;
  NOMBRE_USUARIO: string;
  ID_PRODUCTO: number;
  NOMBRE_PRODUCTO: string;
  CATEGORIA: string;
  CANTIDAD: number;
  PRECIO_UNITARIO: number;
  TOTAL: number;
  FECHA: string;
  NUMERO_VENTA?: string | null;
}

export interface CreateVentaRequest {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  numero_venta?: string;
}

export interface EstadisticasVentas {
  estadisticas_generales: {
    total_transacciones: number;
    total_vendido: number;
    promedio_venta: number;
    total_productos_vendidos: number;
  };
  top_productos: Array<{
    NOMBRE: string;
    CATEGORIA: string;
    total_vendido: number;
    total_ingresos: number;
  }>;
}
