import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { XapiService } from '../xapi.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { HomeHeaderComponent } from '../../shared-components/home-header/home-header.component';
import { FormsModule } from '@angular/forms';
import { PublicInventorySummaryComponent } from './public-inventory-summary/public-inventory-summary.component';
import { FoodCategory, InventoryQuery, Organization } from '../../../../shared/src/kinds';
import { PublicInventoryDetailsComponent } from './public-inventory-details/public-inventory-details.component';

@Component({
    selector: 'food-map',
    imports: [CommonModule, RouterModule, HomeHeaderComponent, MatExpansionModule, FormsModule, PublicInventoryDetailsComponent, PublicInventorySummaryComponent, MatDialogModule],
    templateUrl: './food-map.component.html',
    styleUrl: './food-map.component.scss'
})
export class FoodMapComponent {
    sites: Organization[] = [];
    filterCategoriesInput = "";
    foodCategories: FoodCategory[] = [];
    siteInventoryEmpty: boolean[] = [];
    siteIncludesSearchedCategories: boolean[] = [];
    siteCategoriesLists: string[][] = [];
    viewMode = "LIST-BY-ORGANIZATION";
    dialog = inject(MatDialog);
    constructor(
        private xapiService: XapiService,
        private router: Router
    ) {
    }

    async ngOnInit() {
        this.sites = await this.xapiService.getAllOrganizations();
        this.foodCategories = await this.xapiService.getFoodCategories();
        this.siteInventoryEmpty = this.sites.map(v => false);
        this.siteIncludesSearchedCategories = this.sites.map(v => true);
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
            this.siteIncludesSearchedCategories = this.siteIncludesSearchedCategories.map(v => true);
            return;
        }
        this.siteCategoriesLists.forEach((siteCategoryList, idx) => {
            this.siteIncludesSearchedCategories[idx] = siteCategoryList.filter(categoryName => filterCategoryNames.has(categoryName.toLowerCase())).length > 0;
        });
    }

    clearQuery() {
        this.filterCategoriesInput = "";
        this.runQuery();
    }

    onEmptyInventory(idx: number, isEmpty: boolean) {
        this.siteInventoryEmpty[idx] = isEmpty;
    }

    updateSiteCategories(idx: number, categories: string[]) {
        this.siteCategoriesLists[idx] = categories;
    }

    onClickFullInventoryButton(idx: number) {
        this.dialog.open(PublicInventoryDetailsComponent, {
            data: {
                organizationName: this.sites[idx].name,
                organizationID: this.sites[idx].id
            }
        });
    }

    toggleView() {
        if (this.viewMode === "LIST-BY-ORGANIZATION") {
            this.viewMode = "LIST-BY-CATEGORY";
        } else {
            this.viewMode = "LIST-BY-ORGANIZATION";
        }
        console.log(this.viewMode);
    }
}
