import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { sessionAuthenticator } from '../../utilities/session-authentication';

@Component({
    selector: 'users-user-login',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './user-login.component.html',
    styleUrl: './user-login.component.scss'
})
export class UserLoginComponent {
    username = "";
    password = "";
    loginError: string | undefined;
    failedLoginAttempted = false;
    constructor(private xapiService: XapiService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    async ngOnInit() {
    }

    async submitCreds() {
        const loginResponse = await this.xapiService.login({
            username: this.username,
            password: this.password
        });
        if (!loginResponse?.success) {
            this.failedLoginAttempted = true;
            this.username = "";
            this.password = "";
            this.loginError = loginResponse?.message;
            return;
        }
        sessionAuthenticator.saveLoginSession(loginResponse);
        this.router.navigateByUrl("/dashboard");
    }
}