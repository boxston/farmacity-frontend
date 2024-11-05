import { ApplicationRef, ChangeDetectorRef, Component, OnInit, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatError, MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { MatCheckbox } from "@angular/material/checkbox";
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProductoService } from "../../../core/services/producto.service";
import { ProductosStore } from "../../../core/store/productos.store";
import { Producto } from "../../../core/models/producto.model";
import { CodigoBarra } from "../../../core/models/codigoBarra.model";
@Component({
    selector: 'app-productos-update',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCard,
        MatCardContent,
        MatFormField,
        MatLabel,
        MatIcon,
        MatHint,
        MatInput,
        MatButton,
        MatError,
        MatCheckbox        
    ],
    templateUrl: './productos-update.component.html',
    styleUrls: ['./productos-update.component.scss']
})
export class ProductosUpdateComponent implements OnInit {
    public formParent: FormGroup = new FormGroup({});      
    public idBuscar: FormControl = new FormControl('');
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
    onProductosChange(productos: Producto[]): void {
        console.log("Se han actualizado los productos:", productos);
    }
    ngOnInit(): void {    
        console.log("ProductosStore está inyectado: ", this.productosStore);
        this.initFormParent();
        console.log("init add ", this.productosStore.productos);
    }    
    initFormParent(): void {
        this.formParent = new FormGroup({
            idBuscar: this.idBuscar, 
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
            activo: new FormControl(true),
            fechaAlta: new FormControl('')
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
        
        if (this.formParent.valid) {
            const id = this.formParent.get('idBuscar')?.value;
            const producto = { ...this.formParent.value, id: id };
            console.log("Este se el producto que se manda a actualizar: ", producto);
            
            this.productoService.updateProducto(producto).subscribe((data) => {
                console.log("Producto actualizado", data);
                this.loadProductos();
                this.formParent.reset();
            });
        }
    }    
    loadProductos(): void {
        this.productoService.getProductos().subscribe((data) => {
            this.productosStore.setProductos(data);
            console.log("esta es la data ", data);
            console.log("este el store ", this.productosStore.productos);            
        });
    }
    prevent(event: Event): void {
        event.preventDefault();
    }
    removeCodigoBarra(index: number): void {
        const codigoBarrasArray = this.formParent.get('codigoBarras') as FormArray;
        if (codigoBarrasArray && codigoBarrasArray.length > index) {
            codigoBarrasArray.removeAt(index);
        }
    }

    buscarProducto(): void {
        const id:number = this.formParent.get('idBuscar')?.value;
        console.log("Todos los productos donde buscar: ", this.productosStore.productos);
        
        const producto = this.productosStore.productos.find(p => p.id == id);
    
        if (producto) {
            this.formParent.patchValue({
                nombre: producto.nombre,
                precio: producto.precio,
                cantidadEnStock: producto.cantidadEnStock,
                activo: producto.activo
            });
    
            const codigoBarrasArray = this.formParent.get('codigoBarras') as FormArray;
            codigoBarrasArray.clear();
    
            if (producto.codigoBarras) { 
                producto.codigoBarras.forEach((dato: any) => {
                    const codigoBarraForm = this.initFormCodigoBarras();
                    const fechaAlta = new Date(dato.fechaAlta);
                    const options: Intl.DateTimeFormatOptions = {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    };
                    const formattedFechaAlta = fechaAlta.toLocaleString('en-CA', options).replace(',', '');
                    codigoBarraForm.patchValue({ codigo: dato.codigo, activo: dato.activo, fechaAlta: formattedFechaAlta });
                    codigoBarrasArray.push(codigoBarraForm);
                });
            }
        } else {
            console.log('Producto no encontrado');
        }
    }
}
