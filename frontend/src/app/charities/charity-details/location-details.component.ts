import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { CharityLocation } from '../../kinds';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'charity-location-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './location-details.component.html',
  styleUrl: './location-details.component.scss'
})
export class LocationDetailsComponent {
  location = new CharityLocation();
  constructor(private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }
  /*

  charityID = ""
  locationID = ""
  async ngOnInit() {
    this.charityID = this.activatedRoute.snapshot.params['charityID'];
    this.location.charityID = this.charityID;
    const locationID = this.activatedRoute.snapshot.params['locationID'];
    if(locationID && locationID!='new') {
      this.locationID = locationID;
      this.location = await this.xapiService.getCharityLocation(locationID);
      if(!this.location) {
        this.location = new CharityLocation();
        this.location.charityID = this.charityID;
      }
    }
  }

  async saveClicked() {
    await this.xapiService.saveCharityLocation(this.location!);
    this.router.navigate(['/charities/location-list', this.charityID]);
  }
    */
}
