import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { XapiService } from '../xapi.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { HomeHeaderComponent } from '../../shared-components/home-header/home-header.component';
import { FormsModule } from '@angular/forms';
import { InventorySummaryComponent } from '../../shared-components/inventory-summary-component/inventory-summary.component';

@Component({
    selector: 'food-map',
    imports: [CommonModule, RouterModule, HomeHeaderComponent, MatExpansionModule, FormsModule, InventorySummaryComponent],
    templateUrl: './food-map.component.html',
    styleUrl: './food-map.component.scss'
})
export class FoodMapComponent {
    sites: any[] = [];
    filterCategoriesInput = "";
    hiddenFullInventoryLinkIndices: Set<number> = new Set();
    constructor(
        private xapiService: XapiService,
        private router: Router
    ) {
    }

    async ngOnInit() {
        const stores = await this.xapiService.getAllStores();
        const charities = await this.xapiService.getAllCharities();
        this.sites = [...stores, ...charities];
    }

    onPanelOpened(index: number): void {
        console.log('Opened pantry at index:' + index);
    }

    async runQuery() {

    }

    onEmptyInventory(idx: number) {
        this.hiddenFullInventoryLinkIndices.add(idx);
    }
}
