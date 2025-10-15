import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { sessionAuthenticator } from '../utilities/session-authentication';
import { HeaderComponent } from '../../shared-components/header-component/header.component';
import { UserType } from '../../../../shared/src/kinds';
import { InventorySummaryComponent } from '../../shared-components/inventory-summary-component/inventory-summary.component';

@Component({
  selector: 'dashboard',
  imports: [RouterModule, FormsModule, CommonModule, HeaderComponent, InventorySummaryComponent],
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

  navigateToInventoryDetails() {
    this.router.navigateByUrl('/organization/inventory/details');
  }

  navigateToInventoryUpdates() {
    this.router.navigateByUrl('/organization/inventory/updates/new');
  }

  signOut() {
    sessionAuthenticator.clearCurrentSession();
    this.router.navigateByUrl("home");
  }
}