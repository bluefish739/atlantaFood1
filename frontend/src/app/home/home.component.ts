import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared-components/footer-component/footer.component';
import { User } from '../kinds';
import { XapiService } from '../xapi.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FooterComponent],
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
    let verificationResponse = await this.xapiService.verifyUserBySession();
    console.log("Response from backend for verify user by session:", verificationResponse);
    if (verificationResponse?.hasSession) {
      this.loggedInState = "logged in";
    } else {
      this.loggedInState = "logged out";
    }
  }
}
