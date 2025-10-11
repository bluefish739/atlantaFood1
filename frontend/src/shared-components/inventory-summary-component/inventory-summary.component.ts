import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../app/auth.service';
import { CommonModule } from '@angular/common';
import { XapiService } from '../../app/xapi.service';
import { InventorySummaryRow } from '../../../../shared/src/kinds';

@Component({
  selector: 'inventory-summary',
  imports: [RouterModule, FormsModule, CommonModule, MatProgressBarModule],
  templateUrl: './inventory-summary.component.html',
  styleUrl: './inventory-summary.component.scss'
})
export class InventorySummaryComponent {
  @Input() organizationID = "BLANK";
  @Output() onEmptyInventory = new EventEmitter<boolean>();
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
    if (this.inventorySummaryData.length === 0) {
      this.inventoryStatus = "EMPTY";
      this.onEmptyInventory.emit(true);
      return;
    }
    this.inventoryStatus = "LOADED";
  }
}
