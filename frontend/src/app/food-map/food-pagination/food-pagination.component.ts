import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'food-pagination',
    templateUrl: './food-pagination.component.html',
    styleUrls: ['./food-pagination.component.scss'],
    imports: [CommonModule]
})
export class FoodPaginationComponent {
    @Input() totalPages: number = 1;
    @Input() currentPage: number = 1;
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

    get pages(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.pageChange.emit(this.currentPage);
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }
}