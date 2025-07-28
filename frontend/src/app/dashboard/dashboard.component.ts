import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StoreDashboardComponent } from './store-dashboard.component';
import { PantryDashboardComponent } from './pantry-dashboard.component.';
import { VolunteerDashboardComponent } from './volunteer-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { sessionAuthenticator } from '../utilities/session-authentication';
import { HeaderComponent } from '../../shared-components/header-component/header.component';
import { UserType } from '../../../../shared/src/kinds';

@Component({
  selector: 'dashboard',
  imports: [RouterModule, FormsModule, CommonModule, StoreDashboardComponent,
    PantryDashboardComponent, VolunteerDashboardComponent, AdminDashboardComponent,
    HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userType = "";
  UserType = UserType;
  constructor(
    public authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.userType = sessionAuthenticator.getUserType();
  }

  signOut() {
    sessionAuthenticator.clearCurrentSession();
    this.router.navigateByUrl("home");
  }
}