import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { Store, StoreLocation } from '../../kinds';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'stores-store-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './store-details.component.html',
  styleUrl: './store-details.component.scss'
})
export class StoreDetailsComponent {
  newLocationFormActive = false;
  store = new Store();
  constructor(private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  storeID = ""
  storeLocations: StoreLocation[] = [];
  async ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if(id && id!='new') {
      this.storeLocations = (await this.xapiService.getAllStoreLocations()).filter(location => location.storeID == id);
      this.store = await this.xapiService.getStore(id);
      this.storeID = id;
      if(!this.store) {
        this.store = new Store();
      }
    }
  }

  async saveClicked() {
    await this.xapiService.saveStore(this.store!);
    this.router.navigateByUrl('/stores/list');
  }

  newLocation = new StoreLocation();
  async activateNewLocationForm() {
    this.newLocationFormActive = true;
    this.newLocation.storeID = this.store.id;
  }

  async addLocation() {
    await this.xapiService.saveStoreLocation(this.newLocation);
    this.storeLocations = (await this.xapiService.getAllStoreLocations()).filter(location => location.storeID == this.storeID);
    this.newLocationFormActive = false;
  }
}
