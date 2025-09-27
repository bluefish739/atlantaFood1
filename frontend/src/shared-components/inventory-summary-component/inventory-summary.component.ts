import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../app/auth.service';
import { CommonModule } from '@angular/common';
import { XapiService } from '../../app/xapi.service';
import { InventoryQuery, InventorySummaryRow } from '../../../../shared/src/kinds';

@Component({
  selector: 'inventory-summary',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './inventory-summary.component.html',
  styleUrl: './inventory-summary.component.scss'
})
export class InventorySummaryComponent {
  inventorySummaryData: InventorySummaryRow[] = [];
  constructor(
    public authService: AuthService,
    private xapiService: XapiService,
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
}
