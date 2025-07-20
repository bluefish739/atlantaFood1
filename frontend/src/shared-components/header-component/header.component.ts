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
        
        console.log("made it here1")
        let user = await this.xapiService.verifyUserBySession() as User;
        console.log("made it here2")
        console.log(user);
        if (user) {
            this.loggedIn = true;
            // Get user somehow
        }
    }
}