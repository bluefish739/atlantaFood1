import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'students',
        loadChildren: () => import('./students/students-routing.module').then(mod => mod.StudentsRoutingModule),
    },
    {
        path: 'stores',
        loadChildren: () => import('./stores/stores-routing.module').then(mod => mod.StoreRoutingModule),
    },
    {
        path: 'charities',
        loadChildren: () => import('./charities/charities-routing.module').then(mod => mod.CharityRoutingModule)
    },
    {
        path: 'roles',
        loadChildren: () => import('./roles/roles-routing.module').then(mod => mod.RolesRoutingModule)
    },
    {
        path: 'users',
        loadChildren: () => import('./users/users-routing.module').then(mod => mod.UserRoutingModule)
    }
];
