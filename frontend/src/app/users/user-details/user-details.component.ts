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
    roles: Role[] = [];
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
    }

    async toggleRolesView() {
        this.rolesViewActive = !this.rolesViewActive;
        if (this.rolesViewActive) {
            this.roles = await this.xapiService.getSiteRoles(this.user.siteID as string);
        }
    }

    async saveClicked() {
        await this.xapiService.saveUser(this.user!);
        this.router.navigateByUrl("/users/list")
    }
}