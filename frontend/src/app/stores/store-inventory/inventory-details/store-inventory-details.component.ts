import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InventoryEntry } from '../../../../../../shared/src/kinds';

@Component({
  selector: 'store-inventory-details',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './store-inventory-details.component.html',
  styleUrl: './store-inventory-details.component.scss'
})
export class StoreInventoryDetailsComponent {
  // Get store from user somehow
  // inventory = Store.inventory;

  // Placeholder inventory data
  inventoryData: InventoryEntry[] = [
    {
      foodName: "Tomato",
      units: 47,
      expirationDate: new Date("2025-09-09"),
      source: undefined,
      tags: ["Fresh", "Produce"]
    }
  ]
  constructor() {
    // Generate inventoryData from store.inventory
  }
}
