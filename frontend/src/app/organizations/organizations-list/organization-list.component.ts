import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { Organization } from '../../../../../shared/src/kinds';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'organizations-list',
    templateUrl: './organization-list.component.html',
    styleUrl: './organization-list.component.scss',
    imports: [CommonModule, RouterModule]
})
export class OrganizationsListComponent {
    organizations!: Organization[];
    constructor(private xapiService: XapiService) {
    }

    async ngOnInit() {
        this.organizations = await this.xapiService.getAllOrganizations();
    }
}