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
    },
    {
        path: 'location-list/:id',
        loadComponent: () => import('./store-details/location-list.component').then(c => c.LocationListComponent)
    },
    {
        path: 'location-details/:storeID/:locationID',
        loadComponent: () => import('./store-details/location-details.component').then(c => c.LocationDetailsComponent)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StoreRoutingModule {
}
