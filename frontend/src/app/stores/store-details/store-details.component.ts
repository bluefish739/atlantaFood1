import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { Store } from '../../kinds';
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
  store = new Store();
  constructor(private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if(id && id!='new') {
      this.store = await this.xapiService.getStore(id);
      if(!this.store) {
        this.store = new Store();
      }
    }
  }

  async saveClicked() {
    await this.xapiService.saveStore(this.store!);
    this.router.navigateByUrl('/stores/list');
  }
}
