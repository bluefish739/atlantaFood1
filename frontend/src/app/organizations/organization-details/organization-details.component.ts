import { Component } from "@angular/core";
import { XapiService } from '../../xapi.service';
import { Organization } from '../../../../../shared/src/kinds';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'organizations-details',
    templateUrl: './organization-details.component.html',
    styleUrl: './organization-details.component.scss',
    imports: [CommonModule, FormsModule]
})
export class OrganizationDetailsComponent {
    organization = new Organization();
      constructor(
        private xapiService: XapiService,
        private activatedRoute: ActivatedRoute,
        private router: Router
      ) {
      }
      
      organizationID = "";
      async ngOnInit() {
        const id = this.activatedRoute.snapshot.params['id'];
        if(id && id!='new') {
          this.organization = await this.xapiService.getOrganization(id);
          this.organizationID = id;
          if(!this.organization) {
            this.organization = new Organization();
          }
        }
      }
    
      async saveClicked() {
        await this.xapiService.getOrganization(this.organizationID!);
        this.router.navigateByUrl('/organizations/list');
      }

      goBack() {
        this.router.navigateByUrl('organizations/list');
      }

      viewOrganizationLocations() {
        this.router.navigate(['organizations/locations-list', this.organizationID]);
      }
}