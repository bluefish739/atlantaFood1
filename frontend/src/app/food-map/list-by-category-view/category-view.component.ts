import { Component, OnInit } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategorySummaryRow, Food } from '../../../../../shared/src/kinds';
import { LoadingSpinnerComponent } from '../../../shared-components/loading-spinner-component/loading-spinner.component';

@Component({
    selector: 'category-view',
    templateUrl: './category-view.component.html',
    styleUrls: ['./category-view.component.scss'],
    imports: [CommonModule, RouterModule, LoadingSpinnerComponent]
})
export class CategoryViewComponent implements OnInit {
    viewLoading = true;
    categorySummaryRows: CategorySummaryRow[] = [];
    groupedCategorySummaryRows: { category: string, rows: CategorySummaryRow[] }[] = [];

    constructor(private xapiService: XapiService) {
    }

    async ngOnInit() {
        this.categorySummaryRows = await this.xapiService.getCategorySummaries();
        this.viewLoading = false;
        this.groupedCategorySummaryRows = this.groupByCategory(this.categorySummaryRows);
    }

    private groupByCategory(rows: CategorySummaryRow[]): { category: string, rows: CategorySummaryRow[] }[] {
        const grouped = rows.reduce((acc, row) => {
            const category = row.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(row);
            return acc;
        }, {} as Record<string, CategorySummaryRow[]>);

        return Object.keys(grouped).map(category => ({
            category,
            rows: grouped[category]
        }));
    }
}