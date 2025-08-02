import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DetailedUser, Role, User } from '../../../../../shared/src/kinds';
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
    userRoleIDs: string[] = [];
    constructor(private xapiService: XapiService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    async ngOnInit() {
        const userID = this.activatedRoute.snapshot.params['userID'];
        console.log("ngOnInit: userID=" + userID);
        if (userID && userID != 'new') {
            const detailedUser = await this.xapiService.getDetailedUserByID(userID);
            console.log("ngOnInit: detailedUser=", detailedUser);
            if (detailedUser) {
                this.user = detailedUser.user || new User();
                this.userRoleIDs = detailedUser.userRoleIDs || [];
            }
        }
        this.siteRoles = await this.xapiService.getAllUserRolesOfCurrentOrg();
        this.initRolesRef();
    }

    initRolesRef() {
        this.rolesCheckBoxRef.length = 0;
        this.siteRoles.forEach((role) => {
            if (this.userRoleIDs.includes(role.id as string)) {
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
        this.userRoleIDs.length = 0;
        for (let i = 0; i < this.rolesCheckBoxRef.length; i++) {
            if (this.rolesCheckBoxRef[i]) {
                this.userRoleIDs.push(this.siteRoles[i].id!)
            }
        }
        const detailedUser = new DetailedUser();
        detailedUser.user = this.user;
        detailedUser.userRoleIDs = this.userRoleIDs;
        await this.xapiService.saveUser(detailedUser!);
        this.router.navigateByUrl("/users/list")
    }
}