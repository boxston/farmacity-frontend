import { Injectable, signal } from '@angular/core';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductosStore {
  private _productos = signal<Producto[]>([]);

  get productos() {
    return this._productos();
  }

  setProductos(productos: Producto[]) {
    this._productos.set([...productos]);
  }

  addProducto(newProducto: Producto) {
    if (newProducto) {
      console.log("previo a cambiar ", this.productos);
      
        this._productos.update((productos) => {
            const updatedProductos = [...productos, newProducto];
            console.log("Lista completa de productos después de agregar:", updatedProductos);
            return updatedProductos;
        });
    }
}

  updateProducto(updatedProducto: Producto) {
    this._productos.update((productos) =>
      productos.map(producto => producto.id === updatedProducto.id ? updatedProducto : producto)
    );
  }

  deleteProducto(id: number) {
    this._productos.update((productos) => productos.filter(producto => producto.id !== id));
  }
}
