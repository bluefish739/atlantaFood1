import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { XapiService } from '../xapi.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { HomeHeaderComponent } from '../../shared-components/home-header/home-header.component';
import { FormsModule } from '@angular/forms';
import { InventorySummaryComponent } from '../../shared-components/inventory-summary-component/inventory-summary.component';
import { Organization } from '../../../../shared/src/kinds';
import { PublicInventoryDetailsComponent } from './public-inventory-details/public-inventory-details.component';

@Component({
    selector: 'food-map',
    imports: [CommonModule, RouterModule, HomeHeaderComponent, MatExpansionModule, FormsModule, InventorySummaryComponent, MatDialogModule],
    templateUrl: './food-map.component.html',
    styleUrl: './food-map.component.scss'
})
export class FoodMapComponent {
    sites: Organization[] = [];
    filterCategoriesInput = "";
    siteDisplayStatuses: boolean[] = [];
    inventoryDetails = inject(MatDialog);
    constructor(
        private xapiService: XapiService,
        private router: Router
    ) {
    }

    async ngOnInit() {
        this.sites = await this.xapiService.getAllOrganizations();
        this.siteDisplayStatuses = this.sites.map(v => true);
    }

    onPanelOpened(index: number): void {
        console.log('Opened organization at index:' + index);
    }

    async runQuery() {
    }

    onEmptyInventory(idx: number) {
        this.siteDisplayStatuses[idx] = false;
    }

    onClickFullInventoryButton(idx: number) {
        this.inventoryDetails.open(PublicInventoryDetailsComponent, {
            data: {
                organizationName: this.sites[idx].name,
                organizationID: this.sites[idx].id
            }
        });
    }
}
