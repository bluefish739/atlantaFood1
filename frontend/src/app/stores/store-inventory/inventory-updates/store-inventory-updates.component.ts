import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Food, FoodCategory, GeneralConfirmationResponse, DetailedFood } from '../../../../../../shared/src/kinds';
import { XapiService } from '../../../xapi.service';

@Component({
  selector: 'store-inventory-updates',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './store-inventory-updates.component.html',
  styleUrl: './store-inventory-updates.component.scss'
})
export class StoreInventoryUpdatesComponent {
  food = new Food();
  expirationDate: string | undefined;
  foodCategories: FoodCategory[] = [];
  constructor(
    private xapiService: XapiService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    this.foodCategories = await this.xapiService.getFoodCategories();
  }

  async onSubmit() {
    // Disable submit button until form is valid

    this.food.expirationDate = new Date();
    this.food.currentQuantity = this.food.initialQuantity;
    const detailedFood = new DetailedFood();
    detailedFood.food = this.food;
    // TODO: Make sure this is IDs
    detailedFood.categoryIDs = [];
    const response = await this.xapiService.saveFood(detailedFood);
    console.log(response);
    if (!response.success) {
      // Something went wrong
    } else {
      this.router.navigateByUrl('/stores/inventory/details');
    }
  }
}
