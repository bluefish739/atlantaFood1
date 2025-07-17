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
    loggedIn = false;
    user!: User;
    constructor(
        private xapiService: XapiService,
        private router: Router
    ) {
    }

    async ngOnInit() {
        console.log(await this.xapiService.validateSession());
        if (await this.xapiService.validateSession()) {
            this.loggedIn = true;
            // Get user somehow
        }
    }
}