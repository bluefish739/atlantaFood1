import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategorySummaryRow, Food } from '../../../../../shared/src/kinds';

@Component({
    selector: 'category-view',
    templateUrl: './category-view.component.html',
    styleUrl: './category-view.component.scss',
    imports: [CommonModule, RouterModule]
})
export class CategoryViewComponent {
    categorySummaryRows: CategorySummaryRow[] = [];
    constructor(private xapiService: XapiService) {
    }

    async ngOnInit() {
        this.categorySummaryRows = await this.xapiService.getCategorySummaries();
    }
}