import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { XapiService } from '../xapi.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { HomeHeaderComponent } from '../../shared-components/home-header/home-header.component';
import { FormsModule } from '@angular/forms';
import { PublicInventorySummaryComponent } from './public-inventory-summary/public-inventory-summary.component';
import { FoodCategory, Organization, SitesByCategoryQuery } from '../../../../shared/src/kinds';
import { PublicInventoryDetailsComponent } from './public-inventory-details/public-inventory-details.component';
import { CategoryViewComponent } from './list-by-category-view/category-view.component';

@Component({
    selector: 'food-map',
    imports: [CommonModule, RouterModule, HomeHeaderComponent, MatExpansionModule, FormsModule, PublicInventorySummaryComponent, MatDialogModule, CategoryViewComponent],
    templateUrl: './food-map.component.html',
    styleUrl: './food-map.component.scss'
})
export class FoodMapComponent {
    sites: Organization[] = [];
    filterCategoriesInput = "";
    foodCategories: FoodCategory[] = [];
    viewMode = "LIST-BY-ORGANIZATION";
    dialog = inject(MatDialog);
    constructor(
        private xapiService: XapiService,
        private router: Router
    ) {
    }

    async ngOnInit() {
        this.sites = await this.xapiService.searchSitesByCategories(new SitesByCategoryQuery());
        this.foodCategories = await this.xapiService.getFoodCategories();
    }

    private getFilterCategoryIDs() {
        const filterCategoryIDs = this.filterCategoriesInput
            .split(",")
            .map(categoryName => {
                const cleanCategoryName = categoryName.trim().toLowerCase();
                const category = this.foodCategories.find(foodCategory => foodCategory.name!.toLowerCase() === cleanCategoryName);
                return category ? category.id! : null;
            })
            .filter(v => !!v) as string[];
        return filterCategoryIDs;
    }

    async runQuery() {
        const sitesbyCategoryQuery = new SitesByCategoryQuery();
        sitesbyCategoryQuery.categoryIDs = this.getFilterCategoryIDs();
        this.sites = await this.xapiService.searchSitesByCategories(sitesbyCategoryQuery);
        console.log(this.sites);
    }

    clearQuery() {
        this.filterCategoriesInput = "";
        this.runQuery();
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
        this.filterCategoriesInput = "";
        if (this.viewMode === "LIST-BY-ORGANIZATION") {
            this.viewMode = "LIST-BY-CATEGORY";
        } else {
            this.viewMode = "LIST-BY-ORGANIZATION";
        }
    }
}
