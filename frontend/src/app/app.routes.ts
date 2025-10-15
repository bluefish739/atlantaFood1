import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FoodMapComponent } from './food-map/food-map.component';

export const routes: Routes = [
    { 
        path: 'home',
        component: HomeComponent 
    },
    { 
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'organization',
        loadChildren: () => import('./organizations/organizations-routing.module').then(mod => mod.OrganizationRoutingModule)
    },
    {
        path: 'roles',
        loadChildren: () => import('./roles/roles-routing.module').then(mod => mod.RolesRoutingModule)
    },
    {
        path: 'users',
        loadChildren: () => import('./users/users-routing.module').then(mod => mod.UserRoutingModule)
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'food-map',
        component: FoodMapComponent
    }
];
