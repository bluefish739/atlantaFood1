import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'list',
        loadComponent: () => import('./charity-list/charity-list.component').then(c => c.CharityListComponent)
    },
    {
        path: 'details/:id',
        loadComponent: () => import('./charity-details/charity-details.component').then(c => c.CharityDetailsComponent)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CharityRoutingModule {
}
