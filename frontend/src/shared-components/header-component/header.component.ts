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
        sessionAuthenticator.deleteCookie("sessionID");
        this.router.navigateByUrl("/home");
    }
}