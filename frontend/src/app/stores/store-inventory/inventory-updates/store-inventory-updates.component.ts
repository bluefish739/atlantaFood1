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
  detailedFood = new DetailedFood();
  allFoodCategories: FoodCategory[] = [];
  categoriesCheckboxRef: boolean[];
  isNewFood = true;
  constructor(
    private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.detailedFood.food = new Food();
    this.categoriesCheckboxRef = [];
  }

  async ngOnInit() {
    this.allFoodCategories = await this.xapiService.getFoodCategories();
    const foodID = this.activatedRoute.snapshot.params['foodID'];
    if (foodID && foodID != 'new') {
      const detailedFood = await this.xapiService.getDetailedFoodByID(foodID);
      if (detailedFood) {
        this.detailedFood.food = detailedFood.food || new Food();
        this.detailedFood.categoryIDs = detailedFood.categoryIDs || [];
        this.isNewFood = !this.detailedFood.food.id;
      }
    }
    this.categoriesCheckboxRef = this.allFoodCategories.map(foodCategory => this.detailedFood.categoryIDs.includes(foodCategory.id!));
  }

  async onSubmit() {
    // Disable submit button until form valid
    this.detailedFood.categoryIDs = [];
        for (let i = 0; i < this.categoriesCheckboxRef.length; i++) {
            if (this.categoriesCheckboxRef[i]) {
              this.detailedFood.categoryIDs.push(this.allFoodCategories[i].id!)
            }
        }
    if (this.isNewFood) {
      this.detailedFood.food!.currentQuantity = this.detailedFood.food!.initialQuantity;
    }
    console.log(this.detailedFood);
    console.log(this.categoriesCheckboxRef);
    const response = await this.xapiService.saveFood(this.detailedFood);
    console.log(response);
    if (!response.success) {
      // Something went wrong
    } else {
      this.router.navigateByUrl('/stores/inventory/details');
    }
  }
}
