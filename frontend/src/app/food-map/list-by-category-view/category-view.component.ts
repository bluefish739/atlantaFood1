import { Component, OnInit } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategorySummaryRow, Food } from '../../../../../shared/src/kinds';

@Component({
    selector: 'category-view',
    templateUrl: './category-view.component.html',
    styleUrls: ['./category-view.component.scss'],
    imports: [CommonModule, RouterModule]
})
export class CategoryViewComponent implements OnInit {
    categorySummaryRows: CategorySummaryRow[] = [];
    groupedCategorySummaryRows: { category: string, rows: CategorySummaryRow[] }[] = [];

    constructor(private xapiService: XapiService) {
    }

    async ngOnInit() {
        this.categorySummaryRows = await this.xapiService.getCategorySummaries();
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