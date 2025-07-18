import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pantry-dashboard',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './pantry-dashboard.component.html',
  styleUrl: './pantry-dashboard.component.scss'
})
export class PantryDashboardComponent {
  constructor(public authService: AuthService) {
  }
}
