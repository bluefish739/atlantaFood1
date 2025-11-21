import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { XapiService } from '../../xapi.service';
import { InventorySummaryRow } from '../../../../../shared/src/kinds';

@Component({
  selector: 'public-inventory-summary',
  imports: [RouterModule, FormsModule, CommonModule, MatProgressBarModule],
  templateUrl: './public-inventory-summary.component.html',
  styleUrl: './public-inventory-summary.component.scss'
})
export class PublicInventorySummaryComponent {
  @Input() organizationID = "BLANK";
  @Output() onEmptyInventory = new EventEmitter<boolean>();
  @Output() categoryNames = new EventEmitter<string[]>();
  inventorySummaryData: InventorySummaryRow[] = [];
  inventoryStatus = "";
  constructor(
    public authService: AuthService,
    private xapiService: XapiService,
  ) {
  }

  async ngOnInit() {
    this.inventoryStatus = "LOADING";
    this.inventorySummaryData = await this.xapiService.getInventorySummary(this.organizationID);
    this.inventoryStatus = "LOADED";
    if (this.inventorySummaryData.length === 0) {
      this.inventoryStatus = "EMPTY";
      this.onEmptyInventory.emit(true);
      this.categoryNames.emit([]);
      return;
    }
    this.onEmptyInventory.emit(false);
    this.categoryNames.emit(this.inventorySummaryData.map(row => row.categoryName!));
  }
}
