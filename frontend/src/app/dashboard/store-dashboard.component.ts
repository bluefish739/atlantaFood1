import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { XapiService } from '../xapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryQuery, InventorySummaryRow } from '../../../../shared/src/kinds';

@Component({
  selector: 'store-dashboard',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './store-dashboard.component.html',
  styleUrl: './store-dashboard.component.scss'
})
export class StoreDashboardComponent {
  inventorySummaryData: InventorySummaryRow[] = [];
  constructor(
    public authService: AuthService,
    private xapiService: XapiService,
    private router: Router
  ) {
    this.getInventorySummaryData();
  }

  async getInventorySummaryData() {
    const foodCategories = await this.xapiService.getFoodCategories();
    const inventoryData = await this.xapiService.getInventory(new InventoryQuery());
    this.inventorySummaryData = foodCategories.map(foodCategory => {
      const inventorySummaryRow = new InventorySummaryRow();
      inventorySummaryRow.categoryName = foodCategory.name!;
      inventorySummaryRow.quantitySummary = inventoryData
        .filter(detailedFood => detailedFood.categoryIDs.includes(foodCategory.id!))
        .map(detailedFood => detailedFood.food!.currentQuantity! + " " + detailedFood.food!.units!)
        .join(", ");
      return inventorySummaryRow;
    });
  }

  navigateToInventoryDetails() {
    this.router.navigateByUrl('/stores/inventory/details');
  }

  navigateToInventoryUpdates() {
    this.router.navigateByUrl('/stores/inventory/updates/new');
  }
}
