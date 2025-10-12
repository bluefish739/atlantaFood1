import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../../shared/src/kinds';
import { XapiService } from '../xapi.service';
import { HomeHeaderComponent } from '../../shared-components/home-header/home-header.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, HomeHeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  loggedInState = "";
  user!: User;
  constructor(
    private xapiService: XapiService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    /*
    const verificationResponse = await this.xapiService.verifyUserBySession();
    if (verificationResponse?.hasSession) {
      this.loggedInState = "logged in";
    } else {
      this.loggedInState = "logged out";
    }
      */
  }
}
