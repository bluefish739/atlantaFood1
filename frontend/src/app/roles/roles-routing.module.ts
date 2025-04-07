import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'user-roles',
        loadComponent: () => import('./roles/roles.component').then(c => c.RolesListComponent)
    },
    {
        path: 'role-permissions',
        loadComponent: () => import('./role-permissions/role-permissions.component').then(c => c.RolePermissionsComponent)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RolesRoutingModule {
}