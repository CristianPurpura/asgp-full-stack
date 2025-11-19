export interface Stock {
  ID: number;
  ID_PRODUCTO: number;
  NOMBRE: string;
  DESCRIPCION: string;
  CATEGORIA: string;
  PRECIO: number;
  CANTIDAD_DEPOSITO: number;
  CANTIDAD_SUCURSAL: number;
  CANTIDAD_TOTAL: number;
}

export interface UpdateStockRequest {
  cantidad_deposito: number;
  cantidad_sucursal: number;
}

export interface TransferirStockRequest {
  id_producto: number;
  cantidad: number;
}
