import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { User } from '../../kinds';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { sessionAuthenticator } from '../../utilities/session-authentication';

@Component({
  selector: 'users-user-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UserListComponent {
  users!: User[];
  siteID = "e878dc70-f213-11ef-9653-8d47654d5c1c";
  constructor(
    private xapiService: XapiService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    try {
      this.users = await this.xapiService.getAllSiteUsers(this.siteID);
    } catch (error: any) {
      if (error.status == 401) {
        console.log("Session missing or expired", error);
        this.router.navigateByUrl('users/login');
      }
    }
  }
}