import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { User } from '../../kinds';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'users-user-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UserListComponent {
  users!: User[];
  siteID = "e878dc70-f213-11ef-9653-8d47654d5c1c";
  constructor(private xapiService: XapiService) {

  }
  
  async ngOnInit() {
    this.users = await this.xapiService.getAllSiteUsers(this.siteID);
    console.log(this.users);
  }
}