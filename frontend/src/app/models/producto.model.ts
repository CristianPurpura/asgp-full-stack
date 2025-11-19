export interface Producto {
  ID: number;
  NOMBRE: string;
  DESCRIPCION: string;
  CATEGORIA: string;
  PRECIO: number;
}

export interface CreateProductoRequest {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
}

export interface UpdateProductoRequest {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
}
