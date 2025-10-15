import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { XapiService } from '../../../xapi.service';
import { DetailedFood, FoodCategory, InventoryQuery } from '../../../../../../shared/src/kinds';
import { HeaderComponent } from '../../../../shared-components/header-component/header.component';

@Component({
  selector: 'inventory-details',
  imports: [RouterModule, FormsModule, CommonModule, HeaderComponent],
  templateUrl: './inventory-details.component.html',
  styleUrl: './inventory-details.component.scss'
})
export class InventoryDetailsComponent {
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
    this.inventoryData = await this.xapiService.getInventory(new InventoryQuery(), "BLANK");
    this.foodCategories = await this.xapiService.getFoodCategories();
  }

  navigateToInventoryUpdates() {
    this.router.navigateByUrl('/organization/inventory/updates/new');
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
      this.inventoryData = await this.xapiService.getInventory(inventoryQuery, "BLANK");
    } catch (error: any) {
      console.log("Error: ", error);
    }
  }
}
