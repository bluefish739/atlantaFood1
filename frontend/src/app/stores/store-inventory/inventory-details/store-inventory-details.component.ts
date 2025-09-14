import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { XapiService } from '../../../xapi.service';
import { DetailedFood } from '../../../../../../shared/src/kinds';

@Component({
  selector: 'store-inventory-details',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './store-inventory-details.component.html',
  styleUrl: './store-inventory-details.component.scss'
})
export class StoreInventoryDetailsComponent {
  inventoryData: DetailedFood[] = [];
  constructor(
    private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  async ngOnInit() {
    this.inventoryData = await this.xapiService.getInventory();
  }

  navigateToInventoryUpdates() {
    this.router.navigateByUrl('/stores/inventory/updates/new');
  }

  async removeEntry(foodID: string) {
    const success = await this.xapiService.deleteFood(foodID);
    this.inventoryData = this.inventoryData.filter(detailedFood => detailedFood.food!.id != foodID);
  }
}
