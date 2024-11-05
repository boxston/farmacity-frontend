import { ApplicationRef, ChangeDetectorRef, Component, OnInit, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { ProductosStore } from "../../../core/store/productos.store";
import { ProductoService } from "../../../core/services/producto.service";
import { Producto } from "../../../core/models/producto.model";

@Component({
    selector: 'app-productos-add',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatCardModule
    ],
    templateUrl: './productos-add.component.html',
    styleUrls: ['./productos-add.component.scss']
})

export class ProductosAddComponent implements OnInit {
    public formParent: FormGroup = new FormGroup({});

    constructor(private productoService: ProductoService, private productosStore: ProductosStore, 
        private cdr: ChangeDetectorRef, private appRef: ApplicationRef) {
        this.initEffect(); 
    }

    initEffect(): void {
        effect(() => {
            const productos = this.productosStore.productos;
            console.log("Lista de productos actual:", productos);
            this.onProductosChange(productos);
            this.cdr.detectChanges();
            this.appRef.tick();
        });
    }

    ngOnInit(): void {
        console.log("ProductosStore está inyectado: ", this.productosStore);
        this.initFormParent();
        console.log("init add ", this.productosStore.productos);
    }

    onProductosChange(productos: Producto[]): void {
        console.log("Se han actualizado los productos:", productos);
    }

    initFormParent(): void {
        this.formParent = new FormGroup({
            nombre: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
            precio: new FormControl(0, [Validators.required]),
            cantidadEnStock: new FormControl(0, [Validators.required]),
            activo: new FormControl(true, [Validators.required]),
            codigoBarras: new FormArray([])
        });
    }

    initFormCodigoBarras(): FormGroup {
        return new FormGroup({
            codigo: new FormControl('', [Validators.required, Validators.maxLength(13)]),
            activo: new FormControl(true)
        });
    }

    addCodigoBarra(): void {
        const refCodigoBarra = this.formParent.get('codigoBarras') as FormArray;
        refCodigoBarra.push(this.initFormCodigoBarras());
    }

    getCtrl(key: string, form: FormGroup): any {
        return form.get(key);
    }

    getCodigoBarrasLength(): number {
        const codigoBarrasArray = this.formParent.get('codigoBarras') as FormArray;
        return codigoBarrasArray ? codigoBarrasArray.length : 0;
    }

    onSubmit(): void {
        console.log("antes submit ", this.productosStore.productos);
        if (this.formParent.valid) {
            const producto = this.formParent.value;
            
            this.productoService.addProducto(producto).subscribe((data) => {
                this.productosStore.addProducto(data);
                this.formParent.reset();
            });
        }
    }
}
