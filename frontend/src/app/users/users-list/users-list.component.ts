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
    let sessionID = await sessionAuthenticator.getSessionID();
    if (sessionID === null) {
      alert("Your session has expired! Please log in again.");
      this.router.navigateByUrl('users/login');
      return;
    }
    let sessionActive = await this.xapiService.verifySessionID(sessionID);
    if (!sessionActive) {
      alert("Your session has expired! Please log in again.");
      this.router.navigateByUrl('users/login');
      return;
    }
    this.users = await this.xapiService.getAllSiteUsers(this.siteID, sessionID);
  }
}