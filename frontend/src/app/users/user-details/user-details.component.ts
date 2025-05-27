import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Role, User } from '../../kinds';
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
        const siteID = this.activatedRoute.snapshot.params['siteID'];
        if (id && id != 'new') {
            this.user = await this.xapiService.getUser(id);
            if (!this.user) {
                this.user = new User();
            }
        }
        this.user.siteID = siteID;
        this.siteRoles = await this.xapiService.getSiteRoles(this.user.siteID as string);
        this.siteRoles.forEach((role) => {
            if (this.user.roles.includes(role.id as string)) {
                this.rolesCheckBoxRef.push(true);
            } else {
                this.rolesCheckBoxRef.push(false);
            }
        });
        console.log(this.user.roles);
    }

    toggleRolesView() {
        this.rolesViewActive = !this.rolesViewActive;
    }
    
    toggleRoleStatus(id: string | undefined) {
        console.log(this.user.roles);
        id = id as string;
        let roleIdx: number = this.user.roles.indexOf(id);
        if (roleIdx > -1) {
            this.user.roles.splice(roleIdx, 1);
        } else {
            this.user.roles.push(id);
        }
        console.log(this.user.roles);
    }

    async saveClicked() {
        console.log(this.user.roles);
        await this.xapiService.saveUser(this.user!);
        this.router.navigateByUrl("/users/list")
    }
}