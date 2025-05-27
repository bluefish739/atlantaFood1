import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'list',
        loadComponent: () => import('./users-list/users-list.component').then(c => c.UserListComponent)
    },
    {
        path: 'details/:id/:siteID',
        loadComponent: () => import('./user-details/user-details.component').then(c => c.UserDetailsComponent)
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
