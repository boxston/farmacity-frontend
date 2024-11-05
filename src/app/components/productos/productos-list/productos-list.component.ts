import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, effect } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatCommonModule } from "@angular/material/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ProductosStore } from "../../../core/store/productos.store";
import { Producto } from "../../../core/models/producto.model";
import { ProductoService } from "../../../core/services/producto.service";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'app-productos-list',
    standalone: true,
    imports: [
        CommonModule,
        MatCommonModule,
        MatTableModule,
        MatCardModule,
        MatIcon
    ],
    templateUrl: './productos-list.component.html',
    styleUrls: ['./productos-list.component.css']
})
export class ProductosListComponent implements OnInit {
    productos = new MatTableDataSource<Producto>();
    displayedColumns: string[] = [
        'ID',
        'Nombre',
        'Precio',
        'Stock',
        'Estado',
        'Fecha Alta',
        'Ultima modificacion',
        'Accion'
    ];

    constructor(private productoService: ProductoService, private productosStore: ProductosStore, 
        private cdr: ChangeDetectorRef) {
        this.initEffect();
    }
    
    initEffect(): void {
        effect(() => {
            this.productos.data = [...this.productosStore.productos];
            this.cdr.detectChanges();
        });
    }

    onProductosChange(productos: Producto[]): void {
        console.log("Se han actualizado los productos:", productos);
    }

    ngOnInit(): void {
        this.loadProductos();
    }

    loadProductos(): void {
        this.productoService.getProductos().subscribe((data) => {
            this.productosStore.setProductos(data);
            console.log("esta es la data ", data);
            console.log("este el store ", this.productosStore.productos);            
        });
    }
    
    clickDelete(id: number): void {
        this.productoService.deleteProducto(id).subscribe(()=>{
            this.loadProductos();
        })
    }
}
