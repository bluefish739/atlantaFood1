import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'store-inventory-details',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './store-inventory-details.component.html',
  styleUrl: './store-inventory-details.component.scss'
})
export class StoreInventoryDetailsComponent {
  constructor() {
  }
}
