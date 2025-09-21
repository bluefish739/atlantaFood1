import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { XapiService } from '../../../xapi.service';
import { DetailedFood, FoodCategory } from '../../../../../../shared/src/kinds';

@Component({
  selector: 'store-inventory-details',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './store-inventory-details.component.html',
  styleUrl: './store-inventory-details.component.scss'
})
export class StoreInventoryDetailsComponent {
  inventoryData: DetailedFood[] = [];
  foodCategories: FoodCategory[] = [];
  filterCategoriesInput = "";
  constructor(
    private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  async ngOnInit() {
    this.foodCategories = await this.xapiService.getFoodCategories();
  }

  navigateToInventoryUpdates() {
    this.router.navigateByUrl('/stores/inventory/updates/new');
  }

  async runQuery() {
    try {
      if (this.filterCategoriesInput == "") {
        this.inventoryData = await this.xapiService.getInventory([]);
        return;
      }
      const filterCategoryIDs = this.filterCategoriesInput
        .split(",")
        .map(categoryName => {
          const id = this.foodCategories.find(foodCategory => foodCategory.name?.toLowerCase() == categoryName.trim().toLowerCase())?.id;
          if (id == undefined) {
            throw new Error("Category not found");
          }
          return id;
        });
      this.inventoryData = await this.xapiService.getInventory(filterCategoryIDs);
    } catch (error: any) {
      console.log("Error: category not found");
    }
  }

  async removeEntry(foodID: string) {
    const success = await this.xapiService.deleteFood(foodID);
    this.inventoryData = this.inventoryData.filter(detailedFood => detailedFood.food!.id != foodID);
  }
}
