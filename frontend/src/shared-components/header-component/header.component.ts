import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
//import { SignOutButtonComponent } from '../sign-out-component/sign-out.component';
import { XapiService } from '../../app/xapi.service';
import { User } from '../../app/kinds';

@Component({
    selector: 'page-header',
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    loggedInState = "";
    user!: User;
    constructor(
        private xapiService: XapiService,
        private router: Router
    ) {
    }

    async ngOnInit() {
        let verificationResponse = await this.xapiService.verifyUserBySession();
        console.log("Response from backend for verify user by session:", verificationResponse);
        if (verificationResponse?.hasSession) {
            this.loggedInState = "logged in";
        } else {
            this.loggedInState = "logged out";
        }
    }
}