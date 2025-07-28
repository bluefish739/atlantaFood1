import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { Charity } from '../../../../../shared/src/kinds';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'charities-charity-list',
    templateUrl: './charity-list.component.html',
    styleUrl: './charity-list.component.scss',
    imports: [CommonModule, RouterModule]
})
export class CharityListComponent {
    charities!: Charity[];
    constructor(private xapiService: XapiService) {
    }

    async ngOnInit() {
        this.charities = await this.xapiService.getAllCharities();
    }
}