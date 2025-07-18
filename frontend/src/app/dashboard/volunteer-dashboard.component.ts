import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'volunteer-dashboard',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './volunteer-dashboard.component.html',
  styleUrl: './volunteer-dashboard.component.scss'
})
export class VolunteerDashboardComponent {
  constructor(public authService: AuthService) {
  }
}
