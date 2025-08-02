import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { User } from '../../../../../shared/src/kinds';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared-components/header-component/header.component';
import { FooterComponent } from '../../../shared-components/footer-component/footer.component';
import { sessionAuthenticator } from '../../utilities/session-authentication';

@Component({
  selector: 'users-user-list',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UserListComponent {
  usersData!: User[];
  organizationID = "e878dc70-f213-11ef-9653-8d47654d5c1c";
  currentUserID: string | undefined;
  constructor(
    private xapiService: XapiService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    try {
      this.usersData = await this.xapiService.getAllSiteUsers();
      console.log("ngOnInit: usersData=", this.usersData);
      this.currentUserID = sessionAuthenticator.getUserID();
    } catch (error: any) {
      if (error.status == 401) {
        console.log("Session missing or expired", error);
        this.router.navigateByUrl('users/login');
      }
    }
  }

  async removeUser(userID: string) {
    if (userID == sessionAuthenticator.getUserID()) {
      console.log("removeUser: can't remove self, userID=" + userID);
      return;
    }
    const removalResponse = (await this.xapiService.removeUserFromSite(userID));
    console.log("removeUser: removal response=", removalResponse);
  }
}

//(click)="confirmRemoveUser(user.userID, user.firstName, user.lastName)"