import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'list',
        loadComponent: () => import('./store-list/store-list.component').then(c => c.StoreListComponent)
    },
    {
        path: 'details/:id',
        loadComponent: () => import('./store-details/store-details.component').then(c => c.StoreDetailsComponent)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StoreRoutingModule {
}
