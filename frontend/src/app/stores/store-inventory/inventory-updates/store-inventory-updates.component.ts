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
  errorMessage = "";
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

  private navigateToDetails() {
    this.router.navigateByUrl('/stores/inventory/details');
  }

  cancelButtonClicked() {
    this.navigateToDetails();
  }

  async deleteButtonClicked() {
    const response = await this.xapiService.deleteFood(this.detailedFood.food!.id!);
    if (!response.success) {
      this.errorMessage = response.message || "Unknown Error";
      return;
    }
    this.navigateToDetails();
  }

  async submitButtonClicked() {
    console.log("active");
    try {
      // Disable submit button until form valid
      this.detailedFood.categoryIDs = this.categoriesCheckboxRef.map((assigned, index) => {
        return assigned ? this.allFoodCategories[index].id! : "";
      }).filter(value => value);

      if (this.isNewFood) {
        this.detailedFood.food!.currentQuantity = this.detailedFood.food!.initialQuantity;
      }
      const response = await this.xapiService.saveFood(this.detailedFood);
      console.log("onSubmit: response=", response);
      this.navigateToDetails();
    } catch (error: any) {
      console.log("onSubmit: error=", error);
      if (error.error) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = "Unknown error";
      }
    }

  }
}
