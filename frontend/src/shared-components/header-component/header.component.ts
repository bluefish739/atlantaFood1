import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SignOutButtonComponent } from '../sign-out-component/sign-out.component';

@Component({
    selector: 'page-header',
    imports: [CommonModule, RouterModule, SignOutButtonComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    loggedIn = false;
    constructor(
        private router: Router
    ) {
    }

    async ngOnInit() {
        // Add ability to check whether user is logged in to change loggedIn
        // Greet user by name if logged in
    }
}