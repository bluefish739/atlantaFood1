import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../app/auth.service';
import { CommonModule } from '@angular/common';
import { XapiService } from '../../app/xapi.service';
import { DetailedFood, InventoryQuery, InventorySummaryRow } from '../../../../shared/src/kinds';

@Component({
  selector: 'inventory-summary',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './inventory-summary.component.html',
  styleUrl: './inventory-summary.component.scss'
})
export class InventorySummaryComponent {
  @Input() organizationID = "BLANK";
  @Output() onEmptyInventory = new EventEmitter<boolean>();
  inventorySummaryData: InventorySummaryRow[] = [];
  constructor(
    public authService: AuthService,
    private xapiService: XapiService,
  ) {
  }

  async ngOnInit() {
    this.inventorySummaryData = await this.xapiService.getInventorySummary(this.organizationID);
    if (this.inventorySummaryData.length === 0) {
      this.onEmptyInventory.emit(true);
    }
  }
}
