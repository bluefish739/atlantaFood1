import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { XapiService } from '../xapi.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { HomeHeaderComponent } from '../../shared-components/home-header/home-header.component';
import { FormsModule } from '@angular/forms';
import { PublicInventorySummaryComponent } from './public-inventory-summary/public-inventory-summary.component';
import { FoodCategory, Organization, SitesByCategoryQuery, SitesByCategoryQueryResponse } from '../../../../shared/src/kinds';
import { PublicInventoryDetailsComponent } from './public-inventory-details/public-inventory-details.component';
import { CategoryViewComponent } from './list-by-category-view/category-view.component';
import { FoodPaginationComponent } from './food-pagination/food-pagination.component';
import { LoadingSpinnerComponent } from '../../shared-components/loading-spinner-component/loading-spinner.component';

@Component({
    selector: 'food-map',
    imports: [CommonModule, RouterModule, HomeHeaderComponent, MatExpansionModule, FormsModule, PublicInventorySummaryComponent, MatDialogModule, CategoryViewComponent, LoadingSpinnerComponent, FoodPaginationComponent],
    templateUrl: './food-map.component.html',
    styleUrl: './food-map.component.scss'
})
export class FoodMapComponent {
    sites: Organization[] = [];
    filterCategoriesInput = "";
    foodCategories: FoodCategory[] = [];
    viewStatus = "";
    totalPages = 1;
    dialog = inject(MatDialog);
    constructor(
        private xapiService: XapiService,
        private router: Router
    ) {
    }

    async ngOnInit() {
        this.viewStatus = "SEARCHING";
        const initResponse = await this.xapiService.searchSitesByCategories(new SitesByCategoryQuery());
        this.sites = initResponse.organizations;
        this.totalPages = initResponse.totalPages!;
        this.foodCategories = await this.xapiService.getFoodCategories();
        this.viewStatus = "LIST-BY-ORGANIZATION";
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

    async runNewSearch() {
        this.viewStatus = "SEARCHING";
        await this.runQuery(1);
        this.viewStatus = "LIST-BY-ORGANIZATION";
    }

    private async runQuery(pageNumber: number) {
        const sitesbyCategoryQuery = new SitesByCategoryQuery();
        sitesbyCategoryQuery.categoryIDs = this.getFilterCategoryIDs();
        sitesbyCategoryQuery.pageNumber = pageNumber;

        const response = await this.xapiService.searchSitesByCategories(sitesbyCategoryQuery);
        this.sites = response.organizations;
        this.totalPages = response.totalPages!;
    }

    async onPageChange(pageNumber: number) {
        this.viewStatus = "CHANGING-PAGE";
        await this.runQuery(pageNumber);
        this.viewStatus = "LIST-BY-ORGANIZATION";
    }

    async clearQuery() {
        this.viewStatus = "SEARCHING";
        this.filterCategoriesInput = "";
        await this.runQuery(1);
        this.viewStatus = "LIST-BY-ORGANIZATION";
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
        if (this.viewStatus === "LIST-BY-ORGANIZATION") {
            this.viewStatus = "LIST-BY-CATEGORY";
        } else {
            this.viewStatus = "LIST-BY-ORGANIZATION";
        }
    }
}
