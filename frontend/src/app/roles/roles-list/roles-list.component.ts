import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Role } from '../../../../../shared/src/kinds';

@Component({
    selector: 'roles-list',
    templateUrl: './roles-list.component.html',
    styleUrl: './roles-list.component.scss',
    imports: [CommonModule, RouterModule]
})
export class RolesListComponent {
    roles!: Role[];
    constructor(private xapiService: XapiService) {
    }

    async ngOnInit() {
        // Placeholder site ID
        this.roles = await this.xapiService.getSiteRoles("e878dc70-f213-11ef-9653-8d47654d5c1c");
    }
}