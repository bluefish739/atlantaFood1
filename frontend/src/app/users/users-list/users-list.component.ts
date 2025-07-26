import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { User } from '../../kinds';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared-components/header-component/header.component';
import { FooterComponent } from '../../../shared-components/footer-component/footer.component';

@Component({
  selector: 'users-user-list',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
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
      this.users = await this.xapiService.getAllSiteUsers();
    } catch (error: any) {
      if (error.status == 401) {
        console.log("Session missing or expired", error);
        this.router.navigateByUrl('users/login');
      }
    }
  }

  async removeUser(userID: string) {
    let removalSuccess = (await this.xapiService.removeUserFromSite(userID, this.siteID)).success;
    console.log(removalSuccess);
  }
}

//(click)="confirmRemoveUser(user.userID, user.firstName, user.lastName)"