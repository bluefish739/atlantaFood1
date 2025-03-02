import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./student-list/student-list.component').then(c => c.StudentListComponent)
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./student-details/student-details.component').then(c => c.StudentDetailsComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule {
}
