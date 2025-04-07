import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Role } from '../../kinds';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'role-details',
    templateUrl: './role-details.component.html',
    styleUrl: './roles-details.component.scss',
    imports: [CommonModule, RouterModule, FormsModule]
})
export class RolePermissionsComponent {
    role!: Role;
    constructor(
        private xapiService: XapiService,
        private activatedRoute: ActivatedRoute,
    ) {

    }

    async ngOnInit() {
        const id = this.activatedRoute.snapshot.params['id'];
        if (id) {
            this.role = (await this.xapiService.getRole(id));
        }
    }
}