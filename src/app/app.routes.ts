import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/productos/productos.routes').then(m => m.PRODUCTOS_ROUTES)
    }
];
