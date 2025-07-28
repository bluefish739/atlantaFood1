import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Role, User } from '../../../../../shared/src/kinds';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'users-user-details',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './user-details.component.html',
    styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
    rolesViewActive = false;
    siteRoles: Role[] = [];
    rolesCheckBoxRef: boolean[] = [];
    user = new User();
    constructor(private xapiService: XapiService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    async ngOnInit() {
        const id = this.activatedRoute.snapshot.params['id'];
        const organizationID = this.activatedRoute.snapshot.params['organizationID'];
        if (id && id != 'new') {
            this.user = await this.xapiService.getUserByID(id);
            if (!this.user) {
                this.user = new User();
            }
        }
        this.user.organizationID = organizationID;
        this.siteRoles = await this.xapiService.getSiteRoles(this.user.organizationID as string);
        this.initRolesRef();
    }

    initRolesRef() {
        this.rolesCheckBoxRef.length = 0;
        this.siteRoles.forEach((role) => {
            if (this.user.roles.includes(role.id as string)) {
                this.rolesCheckBoxRef.push(true);
            } else {
                this.rolesCheckBoxRef.push(false);
            }
        });
    }

    toggleRolesView() {
        this.rolesViewActive = !this.rolesViewActive;
    }

    async saveClicked() {
        this.user.roles.length = 0;
        for (let i = 0; i < this.rolesCheckBoxRef.length; i++) {
            if (this.rolesCheckBoxRef[i]) {
                this.user.roles.push(this.siteRoles[i].id!)
            }
        }
        await this.xapiService.saveUser(this.user!);
        this.router.navigateByUrl("/users/list")
    }
}