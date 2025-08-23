import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Food } from '../../../../../../shared/src/kinds';
import { XapiService } from '../../../xapi.service';

@Component({
  selector: 'store-inventory-details',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './store-inventory-details.component.html',
  styleUrl: './store-inventory-details.component.scss'
})
export class StoreInventoryDetailsComponent {
  inventoryData: Food[] = [];
  constructor(
    private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  async ngOnInit() {
    this.inventoryData = await this.xapiService.getStoreInventory();
  }
}
