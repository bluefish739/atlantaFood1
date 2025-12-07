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
    viewMode = "";
    totalPages = 1;
    dialog = inject(MatDialog);
    constructor(
        private xapiService: XapiService,
        private router: Router
    ) {
    }

    async ngOnInit() {
        this.viewMode = "LOADING";
        const initResponse = await this.xapiService.searchSitesByCategories(new SitesByCategoryQuery());
        this.sites = initResponse.organizations;
        this.totalPages = initResponse.totalPages!;
        this.foodCategories = await this.xapiService.getFoodCategories();
        this.viewMode = "LIST-BY-ORGANIZATION";
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

    async runQuery(pageNumber?: number) {
        this.viewMode = "LOADING";
        const sitesbyCategoryQuery = new SitesByCategoryQuery();
        sitesbyCategoryQuery.categoryIDs = this.getFilterCategoryIDs();
        sitesbyCategoryQuery.pageNumber = pageNumber ? pageNumber : 1;

        const response = await this.xapiService.searchSitesByCategories(sitesbyCategoryQuery);
        this.viewMode = "LIST-BY-ORGANIZATION";
        this.sites = response.organizations;
        this.totalPages = response.totalPages!;
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
