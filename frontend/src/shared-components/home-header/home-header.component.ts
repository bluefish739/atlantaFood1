import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../../shared/src/kinds';
import { XapiService } from '../../app/xapi.service';

@Component({
  selector: 'home-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './home-header.component.html',
  styleUrl: './home-header.component.scss'
})
export class HomeHeaderComponent {
  loggedInState = "";
  user!: User;
  constructor(
    private xapiService: XapiService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    const verificationResponse = await this.xapiService.verifyUserBySession();
    if (verificationResponse?.hasSession) {
      this.loggedInState = "LOGGED_IN";
    } else {
      this.loggedInState = "LOGGED_OUT";
    }
  }
}
