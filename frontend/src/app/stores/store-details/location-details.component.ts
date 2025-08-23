import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { Store, StoreLocation } from '../../../../../shared/src/kinds';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'store-location-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './location-details.component.html',
  styleUrl: './location-details.component.scss'
})
export class LocationDetailsComponent {
  location = new StoreLocation();
  constructor(
    private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  storeID = ""
  locationID = ""
  async ngOnInit() {
    this.storeID = this.activatedRoute.snapshot.params['storeID'];
    this.location.storeID = this.storeID;
    const locationID = this.activatedRoute.snapshot.params['locationID'];
    if(locationID && locationID!='new') {
      this.locationID = locationID;
      this.location = await this.xapiService.getStoreLocation(locationID);
      if(!this.location) {
        this.location = new StoreLocation();
        this.location.storeID = this.storeID;
      }
    }
  }

  async saveClicked() {
    await this.xapiService.saveStoreLocation(this.location!);
    this.router.navigate(['/stores/location-list', this.storeID]);
  }
}
