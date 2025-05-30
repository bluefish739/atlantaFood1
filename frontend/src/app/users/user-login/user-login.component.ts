import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'users-user-login',
    imports: [CommonModule, FormsModule],
    templateUrl: './user-login.component.html',
    styleUrl: './user-login.component.scss'
})
export class UserLoginComponent {
    username = "";
    password = "";
    constructor(private xapiService: XapiService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    async ngOnInit() {
    }

    setCookie(name: string, value: string, minutesToLive: number) {
        const date = new Date();
        date.setTime(date.getTime() + minutesToLive * 60 * 1000);
        let expires = `expires=${date.toUTCString()}`
        document.cookie = `${name}=${value}; ${expires}; path=/`
    }

    async submitCreds() {
        this.setCookie("username", this.username, 60);
        this.setCookie("password", this.password, 60);
        console.log(document.cookie);
    }
}