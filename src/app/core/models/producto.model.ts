export interface Producto {
    id?: number;
    nombre: string;
    precio: number;
    cantidadEnStock: number;
    activo: boolean;
    codigoBarras?: string[];
  }
  