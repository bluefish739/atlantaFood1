import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { Store } from '../../../../../shared/src/kinds';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'stores-store-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './store-list.component.html',
    styleUrl: './store-list.component.scss'
})
export class StoreListComponent {
    stores!: Store[];
    constructor(private xapiService: XapiService) {
    }

    async ngOnInit() {
        this.stores = await this.xapiService.getAllStores();
    }
}
