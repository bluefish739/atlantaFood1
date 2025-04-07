import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Role } from '../../kinds';
import { FormsModule } from '@angular/forms';
import { permissions } from '../permissions';

@Component({
    selector: 'role-details',
    templateUrl: './role-details.component.html',
    styleUrl: './roles-details.component.scss',
    imports: [CommonModule, RouterModule, FormsModule]
})
export class RolePermissionsComponent {
    role: Role = new Role();
    permissions = permissions;
    constructor(
        private xapiService: XapiService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {

    }

    assignBlankPermissions(role: Role): Role {
        role.permissions = [];
        for (let permission of permissions) {
            role.permissions.push({
                permissionName: permission.name as string,
                enabled: false
            });
        }
        return role;
    }

    async ngOnInit() {
        const siteID = this.activatedRoute.snapshot.params['siteID'];
        const roleID = this.activatedRoute.snapshot.params['roleID'];
        this.role.siteID = siteID;
        this.role = this.assignBlankPermissions(this.role);
        if (roleID && roleID != 'new') {
            this.role = await this.xapiService.getRole(roleID);
            if (!this.role) {
                this.role = new Role();
                this.role = this.assignBlankPermissions(this.role);
            }
        }
    }

    async saveClicked() {
        await this.xapiService.saveRole(this.role!);
        this.router.navigateByUrl('/roles/roles-list');
      }
}