import { Component, OnInit } from "@angular/core";
import { ProductosStore } from "../../core/store/productos.store";
import { ProductoService } from "../../core/services/producto.service";

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from "@angular/common";
import { Producto } from "../../core/models/producto.model";
import { MatCommonModule } from "@angular/material/core";

@Component({
    selector: 'app-productos-list',
    standalone: true,
    imports: [
        CommonModule,
        MatCommonModule,
        MatTableModule
    ],
    providers: [
        ProductosStore
    ],
    templateUrl: './productos-list.component.html',
    styleUrls: ['./productos-list.component.css']
})
export class ProductosListComponent implements OnInit{
    productos = new MatTableDataSource<Producto>();    
    displayedColumns: string[] = [
        'ID',
        'Nombre',
        'Codigo de Barra',
        'Precio',
        'Stock',
        'Estado',
        'Fecha Alta',
        'Ultima modificacion'
    ];

    constructor(private productoService: ProductoService, private productosStore: ProductosStore) {
        this.productos = new MatTableDataSource<Producto>([]);
    }

    ngOnInit(): void {
        this.loadProductos();
    }

    loadProductos(): void {
        this.productoService.getProductos().subscribe((data) => {
            this.productosStore.setProducts(data);
            this.productos.data = data;
            console.log(data);            
        });
    }
}