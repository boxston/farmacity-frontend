import { signal } from '@angular/core';
import { Producto } from '../models/producto.model';

export class ProductosStore {
  productos = signal<Producto[]>([]);

  setProducts(newProductos: Producto[]) {
    this.productos.set(newProductos);
  }

  addProducto(newProducto: Producto) {
    this.productos.update((productos) => [...productos, newProducto]);
  }

  updateProducto(updatedProducto: Producto) {
    this.productos.update((productos) => 
      productos.map(producto => producto.id === updatedProducto.id ? updatedProducto : producto)
    );
  }

  deleteProducto(id: number) {
    this.productos.update((productos) => productos.filter(producto => producto.id !== id));
  }
}
