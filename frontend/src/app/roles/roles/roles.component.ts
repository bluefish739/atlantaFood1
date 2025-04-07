import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'roles-list',
    templateUrl: './roles-component.html',
    styleUrl: './roles-component.scss',
    imports: [CommonModule, RouterModule]
})
export class RolesListComponent {
    constructor(private xapiService: XapiService) {
    }
}