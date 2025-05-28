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
    permsCheckBoxRef: boolean[] = [];
    permissions = permissions;
    constructor(
        private xapiService: XapiService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {

    }

    async ngOnInit() {
        const siteID = this.activatedRoute.snapshot.params['siteID'];
        const roleID = this.activatedRoute.snapshot.params['roleID'];
        this.role.siteID = siteID;
        if (roleID && roleID != 'new') {
            this.role = await this.xapiService.getRole(roleID);
            if (!this.role) {
                this.role = new Role();
            }
        }
        this.initPermsRef()
    }

    initPermsRef() {
        this.permissions.forEach((perm) => {
            if (this.role.permissions.includes(perm.name as string)) {
                this.permsCheckBoxRef.push(true);
            } else {
                this.permsCheckBoxRef.push(false);
            }
        });
    }

    async saveClicked() {
        this.role.permissions.length = 0;
        for (let i = 0; i < this.permsCheckBoxRef.length; i++) {
            if (this.permsCheckBoxRef[i]) {
                this.role.permissions.push(this.permissions[i].name!)
            }
        }
        await this.xapiService.saveRole(this.role!);
        this.router.navigateByUrl('/roles/roles-list');
      }
}