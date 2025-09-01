import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Food, FoodCategory, GeneralConfirmationResponse, DetailedFood } from '../../../../../../shared/src/kinds';
import { toDate, formatDateToString } from '../../../../../../shared/src/utilities';
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
  isNewFood = true;
  constructor(
    private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.detailedFood.food = new Food();
  }

  async ngOnInit() {
    this.allFoodCategories = await this.xapiService.getFoodCategories();
    const foodID = this.activatedRoute.snapshot.params['foodID'];
    console.log("ngOnInit: foodID=" + foodID);
    if (foodID && foodID != 'new') {
      const detailedFood = await this.xapiService.getDetailedFoodByID(foodID);
      console.log("ngOnInit: detailedFood=", detailedFood);
      if (detailedFood) {
        this.detailedFood.food = detailedFood.food || new Food();
        this.detailedFood.categoryIDs = detailedFood.categoryIDs || [];
        //this.originalUser = this.createOriginalCopyOfUser(this.user, this.userRoleIDs);
        this.isNewFood = !this.detailedFood.food.id;
      }
    }
    //this.availableRoles = await this.xapiService.getAllUserRolesOfCurrentOrg();
    //this.initRolesRef();
  }

  async onSubmit() {
    // Disable submit button until form is valid
    if (this.isNewFood) {
      this.detailedFood.food!.currentQuantity = this.detailedFood.food!.initialQuantity;
    }
    const response = await this.xapiService.saveFood(this.detailedFood);
    console.log(response);
    if (!response.success) {
      // Something went wrong
    } else {
      this.router.navigateByUrl('/stores/inventory/details');
    }
  }
}
