import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../kinds';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'users-user-details',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './user-details.component.html',
    styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
    user!: User;
    constructor(private xapiService: XapiService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    async ngOnInit() {
        const siteID = this.activatedRoute.snapshot.params['id'];
        this.user = {
            userName: "ouiOuiMaster",
            firstName: "Johnathon",
            lastName: "Von Mousou",
            siteID: siteID,
            phoneNumber: "123-456-7890",
            roles: []
        }
    }
}