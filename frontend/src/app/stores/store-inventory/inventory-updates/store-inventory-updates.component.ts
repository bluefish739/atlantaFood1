import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Food, GeneralConfirmationResponse, InventoryEntry } from '../../../../../../shared/src/kinds';
import { XapiService } from '../../../xapi.service';
import { foodCategories } from '../../../../../../shared/src/food-categories';

@Component({
  selector: 'store-inventory-updates',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './store-inventory-updates.component.html',
  styleUrl: './store-inventory-updates.component.scss'
})
export class StoreInventoryUpdatesComponent {
  food = new Food();
  expirationDate: string | undefined;
  foodCategories = foodCategories;
  constructor(
    private xapiService: XapiService,
    private router: Router
  ) {
  }

  async onSubmit() {
    // Disable submit button until form is valid

    this.food.entryDate = Date.now();
    const date = new Date(this.expirationDate + "T00:00:00Z");
    this.food.expirationDate = date.getTime();
    const response = await this.xapiService.saveFood(this.food);
    if (!response.success) {
      // Something went wrong
    } else {
      this.router.navigateByUrl('/stores/inventory/details');
    }
  }
}
