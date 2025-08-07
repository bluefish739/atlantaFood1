import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'roles-list',
        loadComponent: () => import('./roles-list/roles-list.component').then(c => c.RolesListComponent)
    },
    {
        path: 'role-details/:roleID',
        loadComponent: () => import('./role-details/role-details.component').then(c => c.RolePermissionsComponent)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RolesRoutingModule {
}