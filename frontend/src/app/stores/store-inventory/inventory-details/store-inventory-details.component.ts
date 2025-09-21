import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { XapiService } from '../../../xapi.service';
import { DetailedFood, FoodCategory, InventoryQuery } from '../../../../../../shared/src/kinds';

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
    this.inventoryData = await this.xapiService.getInventory(new InventoryQuery());
    this.foodCategories = await this.xapiService.getFoodCategories();
  }

  navigateToInventoryUpdates() {
    this.router.navigateByUrl('/stores/inventory/updates/new');
  }

  async runQuery() {
    try {
      const filterCategoryIDs = this.filterCategoriesInput
        .split(",")
        .map(categoryName => {
          const cleanCategoryName = categoryName.trim().toLowerCase();
          if (!cleanCategoryName) {
            return "";
          }
          const id = this.foodCategories.find(foodCategory => foodCategory.name?.toLowerCase() == cleanCategoryName)?.id;
          return id || "";
        }).filter(filterCategoryID => !!filterCategoryID);
      const inventoryQuery = new InventoryQuery();
      inventoryQuery.categoryIDs = filterCategoryIDs;
      this.inventoryData = await this.xapiService.getInventory(inventoryQuery);
    } catch (error: any) {
      console.log("Error: ", error);
    }
  }

  async removeEntry(foodID: string) {
    const success = await this.xapiService.deleteFood(foodID);
    this.inventoryData = this.inventoryData.filter(detailedFood => detailedFood.food!.id != foodID);
  }
}
