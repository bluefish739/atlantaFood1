import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  constructor(public authService: AuthService) {
  }

  async signupClicked() {
    await this.authService.signUp(this.email, this.password);
  }

  async signinClicked() {
    await this.authService.signIn(this.email, this.password);
  }
}
