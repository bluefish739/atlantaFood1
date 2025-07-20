import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

    constructor(private http: HttpClient, private router: Router) { }

    onSubmit() {
        // Validate passwords match
        if (this.signupData.password !== this.signupData.confirmPassword) {
            this.errorMessage = 'Passwords do not match. Please try again.';
            return;
        }

        // Validate user type is selected
        if (!this.signupData.userType) {
            this.errorMessage = 'Please select a user type.';
            return;
        }

        // Prepare data for API
        const payload = {
            username: this.signupData.username,
            password: this.signupData.password,
            userType: this.signupData.userType
        };

        // Submit to API
        this.http.post('/api/signup', payload).subscribe({
            next: () => {
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Failed to sign up. Please try again.';
            }
        });
    }
}