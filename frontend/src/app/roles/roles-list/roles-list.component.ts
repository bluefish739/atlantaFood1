import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Role } from '../../kinds';

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
        this.roles = await this.xapiService.getSiteRoles("qoie");
    }
}