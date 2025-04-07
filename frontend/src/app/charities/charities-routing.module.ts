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
    },
    {
        path: 'locations-list/:id',
        loadComponent: () => import('./charity-details/location-list.component').then(c => c.LocationListComponent)
    },
    {
        path: 'location-details/:charityID/:locationID',
        loadComponent: () => import('./charity-details/location-details.component').then(c => c.LocationDetailsComponent)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CharityRoutingModule {
}