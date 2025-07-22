import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignupData } from '../../kinds';
import { XapiService } from '../../xapi.service';

@Component({
    selector: 'app-signup',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './user-signup.component.html',
    styleUrls: ['./user-signup.component.scss']
})
export class UserSignupComponent {
    signupData = {
        username: '',
        password: '',
        confirmPassword: '',
        userType: ''
    };
    errorMessage: string = '';

    constructor(
        private router: Router,
        private xapiService: XapiService
    ) { }

    async onSubmit() {
        if (this.signupData.password !== this.signupData.confirmPassword) {
            this.errorMessage = 'Passwords do not match. Please try again.';
            return;
        }

        if (!this.signupData.userType) {
            this.errorMessage = 'Please select a user type.';
            return;
        }

        // TODO: fix userType to accept this.signupData.userType
        const payload: SignupData = {
            username: this.signupData.username,
            password: this.signupData.password,
            userType: this.signupData.userType as any
        };

        const signupResponse = await this.xapiService.signupUser(payload);
        if (signupResponse?.success) {
            await this.xapiService.submitCreds(this.signupData.username, this.signupData.password);
            this.router.navigateByUrl("/dashboard");
        } else {
            console.log("Sign up response:", signupResponse);
            this.errorMessage = signupResponse.message!;
        }
    }
}