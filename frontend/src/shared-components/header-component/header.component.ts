import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { sessionAuthenticator } from '../../app/utilities/session-authentication';

@Component({
    selector: 'page-header',
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    userType = "";
    constructor(
        private router: Router
    ) {
        this.userType = "store";
    }

    signOut() {
        sessionAuthenticator.clearCurrentSession();
        this.router.navigateByUrl("/home");
    }

    goToInventory() {
        const userType = sessionAuthenticator.getUserType();
        let pathHead: string;
        switch (userType) {
            case "Store":
                pathHead = "stores"
                break;
            case "Pantry":
                pathHead = "organizations"
                break;
            case "Volunteer":
                pathHead = "volunteers"
                break;
            case "Admin":
                pathHead = "admins"
                break;
            default:
                return;
        }
        this.router.navigateByUrl(`/${pathHead}/inventory/details`);
    }
}