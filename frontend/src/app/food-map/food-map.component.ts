import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { XapiService } from '../xapi.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { HomeHeaderComponent } from '../../shared-components/home-header/home-header.component';
import { FormsModule } from '@angular/forms';
import { InventorySummaryComponent } from '../../shared-components/inventory-summary-component/inventory-summary.component';
import { FoodCategory, InventoryQuery, Organization } from '../../../../shared/src/kinds';
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
    foodCategories: FoodCategory[] = [];
    siteDisplayStatuses: boolean[] = [];

    //siteInventoryEmpty: boolean[] = [];
    //siteIncludeSearchedCategories: boolean[] = [];

    siteCategoriesLists: string[][] = [];
    inventoryDetails = inject(MatDialog);
    constructor(
        private xapiService: XapiService,
        private router: Router
    ) {
    }

    async ngOnInit() {
        this.sites = await this.xapiService.getAllOrganizations();
        this.foodCategories = await this.xapiService.getFoodCategories();
        this.siteDisplayStatuses = this.sites.map(v => true);
        this.siteCategoriesLists = this.sites.map(v => []);
    }

    onPanelOpened(index: number): void {
        console.log('Opened organization at index:' + index);
    }

    private getFilterCategoryNames() {
        const filterCategoryNames = new Set(
            this.filterCategoriesInput
                .split(",")
                .map(categoryName => {
                    const cleanCategoryName = categoryName.trim().toLowerCase();
                    return cleanCategoryName ? cleanCategoryName : "";
                })
                .filter(v => !!v)
        );
        return filterCategoryNames;
    }

    runQuery() {
        const filterCategoryNames = this.getFilterCategoryNames();
        if (filterCategoryNames.size === 0) {
            return;
        }
        this.siteCategoriesLists.forEach((siteCategoryList, idx) => {
            this.siteDisplayStatuses[idx] = siteCategoryList.filter(categoryName => filterCategoryNames.has(categoryName.toLowerCase())).length > 0;
        });
    }

    onEmptyInventory(idx: number, isEmpty: boolean) {
        this.siteDisplayStatuses[idx] = !isEmpty;
    }

    updateSiteCategories(idx: number, categories: string[]) {
        this.siteCategoriesLists[idx] = categories;
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
