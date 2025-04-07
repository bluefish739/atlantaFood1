import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'role-details',
    templateUrl: './role-details.component.html',
    styleUrl: './roles-details.component.scss',
    imports: [CommonModule, RouterModule]
})
export class RolePermissionsComponent {
    constructor(private xapiService: XapiService) {
    }
}