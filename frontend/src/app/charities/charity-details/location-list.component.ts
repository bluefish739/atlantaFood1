import { Component } from '@angular/core';
/*
import { XapiService } from '../../xapi.service';
import { CharityLocation } from '../../kinds';
*/
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'charities-locations-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './location-list.component.html',
  styleUrl: './location-list.component.scss'
})
export class LocationListComponent {
    /*
  constructor(private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  charityID = ""
  charityLocations: CharityLocation[] = [];
  async ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.charityLocations = (await this.xapiService.getStoreLocations(id));
      this.charityID = id;
    }
  }
  
  navigateBackToCharityDetails() {
    this.router.navigate(['/stores/details', this.charityID]);
  }*/
}
