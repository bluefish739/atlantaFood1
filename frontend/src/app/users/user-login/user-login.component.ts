import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { sessionAuthenticator } from '../../utilities/session-authentication';

@Component({
    selector: 'users-user-login',
    imports: [CommonModule, FormsModule],
    templateUrl: './user-login.component.html',
    styleUrl: './user-login.component.scss'
})
export class UserLoginComponent {
    username = "";
    password = "";
    failedLoginAttempted = false;
    constructor(private xapiService: XapiService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    async ngOnInit() {
    }

    async submitCreds() {
        const sessionID = await this.xapiService.submitCreds(this.username, this.password);
        if (sessionID == "Invalid Credentials") {
            this.failedLoginAttempted = true;
            this.username = "";
            this.password = "";
            return;
        }
        sessionAuthenticator.setCookie("sessionID", sessionID, 60);
        this.router.navigateByUrl("/users/list")
    }
}