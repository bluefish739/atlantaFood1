import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrl: './loading-spinner.component.scss',
    imports: [MatProgressSpinnerModule]
})
export class LoadingSpinnerComponent {
    constructor() {
    }

    async ngOnInit() {
    }
}