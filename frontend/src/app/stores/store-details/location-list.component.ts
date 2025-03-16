import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { Store, StoreLocation } from '../../kinds';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'stores-locations-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './location-list.component.html',
  styleUrl: './location-list.component.scss'
})
export class LocationListComponent {
  constructor(private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  storeID = ""
  storeLocations: StoreLocation[] = [];
  async ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.storeLocations = (await this.xapiService.getAllStoreLocations()).filter(location => location.storeID == id);
      this.storeID = id;
    }
  }

  async addLocation() {
    
  }

  navigateBackToStoreDetails() {
    this.router.navigate(['/stores/details', this.storeID]);
  }
}
