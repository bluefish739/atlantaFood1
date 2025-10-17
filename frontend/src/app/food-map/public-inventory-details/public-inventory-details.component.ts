import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { XapiService } from '../../xapi.service';
import { DetailedFood, FoodCategory, InventoryQuery } from '../../../../../shared/src/kinds';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'public-inventory-details',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './public-inventory-details.component.html',
  styleUrl: './public-inventory-details.component.scss'
})
export class PublicInventoryDetailsComponent {
  inventoryData: DetailedFood[] = [];
  foodCategories: FoodCategory[] = [];
  filterCategoriesInput = "";
  organizationName = "";
  constructor(
    private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {organizationName: string, organizationID: string}
  ) {
  }

  async ngOnInit() {
    this.inventoryData = await this.xapiService.getInventory(new InventoryQuery(), this.data.organizationID);
    this.foodCategories = await this.xapiService.getFoodCategories();
    this.organizationName = this.data.organizationName;
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
      this.inventoryData = await this.xapiService.getInventory(inventoryQuery, this.data.organizationID);
    } catch (error: any) {
      console.log("Error: ", error);
    }
  }
}
