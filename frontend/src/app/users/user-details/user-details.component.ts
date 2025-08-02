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
    availableRoles: Role[];
    rolesCheckBoxRef: boolean[];
    private userRoleIDs: string[];
    user: User;
    private originalUser: DetailedUser;
    isNewUser: boolean;
    isSuccessMessage: boolean;
    message: string;
    constructor(private xapiService: XapiService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.userRoleIDs = [];
        this.rolesCheckBoxRef = [];
        this.availableRoles = [];
        this.user = new User();
        this.originalUser = new DetailedUser();
        this.originalUser.user = new User();
        this.isNewUser = true;
        this.isSuccessMessage = false;
        this.message = "";
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
                this.originalUser = this.createOriginalCopyOfUser(this.user, this.userRoleIDs);
                this.isNewUser = !this.user.userID;
            }
        }
        this.availableRoles = await this.xapiService.getAllUserRolesOfCurrentOrg();
        this.initRolesRef();
    }

    createOriginalCopyOfUser(user: User, userRoleIDs: string[]) {
        const originalUser = new User();
        originalUser.firstName = user.firstName;
        originalUser.lastName = user.lastName;
        originalUser.username = user.username;
        originalUser.phoneNumber = user.phoneNumber;
        originalUser.firstName = user.firstName;

        const originalDetailedUser = new DetailedUser();
        originalDetailedUser.user = originalUser;
        originalDetailedUser.userRoleIDs = userRoleIDs.slice();
        return originalDetailedUser;
    }

    initRolesRef() {
        this.rolesCheckBoxRef = [];
        this.availableRoles.forEach((availableRole) => {
            if (this.userRoleIDs.includes(availableRole.id!)) {
                this.rolesCheckBoxRef.push(true);
            } else {
                this.rolesCheckBoxRef.push(false);
            }
        });
    }

    getSelectedRolesCount() {
        return this.rolesCheckBoxRef.filter(value => value).length;
    }

    isFormDirty(): boolean {
        if (this.user == undefined) console.log("isFormDirty: user=undefined");
        if (this.originalUser.user == undefined) console.log("isFormDirty: originalUser.user=undefined");
        return (
            this.user.username !== this.originalUser.user!.username ||
            this.user.firstName !== this.originalUser.user!.firstName ||
            this.user.lastName !== this.originalUser.user!.lastName ||
            this.user.phoneNumber !== this.originalUser.user!.phoneNumber ||
            JSON.stringify(this.userRoleIDs.slice().sort()) !== JSON.stringify(this.originalUser.userRoleIDs.sort())
        );
    }

    async onSubmit() {
        this.userRoleIDs.length = 0;
        for (let i = 0; i < this.rolesCheckBoxRef.length; i++) {
            if (this.rolesCheckBoxRef[i]) {
                this.userRoleIDs.push(this.availableRoles[i].id!)
            }
        }
        const detailedUser = new DetailedUser();
        detailedUser.user = this.user;
        detailedUser.userRoleIDs = this.userRoleIDs;
        await this.xapiService.saveUser(detailedUser!);
        this.router.navigateByUrl("/users/list")
    }
}