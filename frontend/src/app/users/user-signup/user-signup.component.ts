import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { sessionAuthenticator } from '../../utilities/session-authentication';

@Component({
    selector: 'users-user-signup',
    imports: [CommonModule, FormsModule],
    templateUrl: './user-signup.component.html',
    styleUrl: './user-signup.component.scss'
})
export class UserSignupComponent {
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
}