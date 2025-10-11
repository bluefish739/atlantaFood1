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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationRoutingModule {
}