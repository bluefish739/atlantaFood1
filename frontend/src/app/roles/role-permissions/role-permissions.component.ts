import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'role-permissions',
    templateUrl: './role-permissions-component.html',
    styleUrl: './roles-permissions-component.scss',
    imports: [CommonModule, RouterModule]
})
export class RolePermissionsComponent {
    constructor(private xapiService: XapiService) {
    }
}