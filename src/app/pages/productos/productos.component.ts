import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ProductosStore } from "../../core/store/productos.store";
import { ProductosListComponent } from "../../components/productos/productos-list/productos-list.component";
import { ProductosAddComponent } from "../../components/productos/productos-add/productos-add.component";
import { ProductoService } from "../../core/services/producto.service";
@Component({
    selector: 'app-productos',
    standalone: true,
    imports: [
        CommonModule,
        ProductosListComponent,
        ProductosAddComponent
    ],
    providers: [
        ProductosStore
    ],
    templateUrl: './productos.component.html',
    styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit{
    constructor(private productoService: ProductoService, private productosStore: ProductosStore) {}

    ngOnInit(): void {
        this.loadProductos();
    }
    loadProductos(): void {
        this.productoService.getProductos().subscribe((data) => {
            console.log("Cargando productos en el store:", data);
            this.productosStore.setProductos(data);
        });
    }
}