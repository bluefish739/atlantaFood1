import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'list',
        loadComponent: () => import('./organizations-list/organization-list.component').then(c => c.OrganizationsListComponent)
    },
    {
        path: 'details/:id',
        loadComponent: () => import('./organization-details/organization-details.component').then(c => c.OrganizationDetailsComponent)
    },
    {
        path: 'inventory/details',
        loadComponent: () => import('./organization-inventory/inventory-details/inventory-details.component').then(c => c.InventoryDetailsComponent)
    },
    {
        path: 'inventory/updates/:foodID',
        loadComponent: () => import('./organization-inventory/inventory-updates/inventory-updates.component').then(c => c.InventoryUpdatesComponent)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationRoutingModule {
}