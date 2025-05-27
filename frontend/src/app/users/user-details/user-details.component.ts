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
    user = new User();
    constructor(private xapiService: XapiService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    async ngOnInit() {
        const id = this.activatedRoute.snapshot.params['id'];
        const siteID = this.activatedRoute.snapshot.params['siteID'];
        console.log(id);
        if (id && id != 'new') {
            this.user = await this.xapiService.getUser(id);
            if (!this.user) {
                this.user = new User();
            }
        }
        this.user.siteID = siteID;
    }

    async saveClicked() {
        console.log(this.user)
        await this.xapiService.saveUser(this.user!);
        this.router.navigateByUrl("/users/list")
    }
}