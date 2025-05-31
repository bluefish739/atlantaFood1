import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { sessionAuthenticator } from '../../app/utilities/session-authentication';

@Component({
  selector: 'sign-out-button',
  imports: [CommonModule, RouterModule],
  templateUrl: './sign-out.component.html',
  styleUrl: './sign-out.component.scss'
})
export class SignOutButtonComponent {
  constructor(
    private router: Router
  ) {
  }

  async ngOnInit() {
  }

  signOut() {
    sessionAuthenticator.deleteCookie("sessionID");
    console.log("Signing out");
    this.router.navigateByUrl("users/login");
  }
}