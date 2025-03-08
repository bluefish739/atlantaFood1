import { Component } from "@angular/core";
import { XapiService } from '../../xapi.service';
import { Charity } from '../../kinds';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'charities-charity-details',
    templateUrl: './charity-details.component.html',
    styleUrl: './charity-details.component.scss',
    imports: [CommonModule, FormsModule]
})
export class CharityDetailsComponent {
    charity = new Charity();
      constructor(
        private xapiService: XapiService,
        private activatedRoute: ActivatedRoute,
        private router: Router
      ) {
      }
    
      async ngOnInit() {
        const id = this.activatedRoute.snapshot.params['id'];
        if(id && id!='new') {
          this.charity = await this.xapiService.getCharity(id);
          if(!this.charity) {
            this.charity = new Charity();
          }
        }
      }
    
      async saveClicked() {
        await this.xapiService.saveCharity(this.charity!);
        this.router.navigateByUrl('/charities/list');
      }

      goBack() {
        this.router.navigateByUrl('charities/list');
      }
}