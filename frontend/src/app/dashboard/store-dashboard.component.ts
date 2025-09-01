import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { XapiService } from '../xapi.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'store-dashboard',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './store-dashboard.component.html',
  styleUrl: './store-dashboard.component.scss'
})
export class StoreDashboardComponent {
  constructor(
    public authService: AuthService,
    private xapiService: XapiService,
    private router: Router
  ) {
  }

  navigateToInventoryDetails() {
    this.router.navigateByUrl('/stores/inventory/details');
  }

  navigateToInventoryUpdates() {
    this.router.navigateByUrl('/stores/inventory/updates/new');
  }
}
