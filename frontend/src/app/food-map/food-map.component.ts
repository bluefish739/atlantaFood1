import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { XapiService } from '../xapi.service';
import { HomeHeaderComponent } from '../../shared-components/home-header/home-header.component';

@Component({
  selector: 'food-map',
  imports: [CommonModule, RouterModule, HomeHeaderComponent],
  templateUrl: './food-map.component.html',
  styleUrl: './food-map.component.scss'
})
export class FoodMapComponent {
  constructor(
    private xapiService: XapiService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    
  }
}
