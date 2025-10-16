import { Component } from "@angular/core";
import { XapiService } from '../../xapi.service';
import { Organization } from '../../../../../shared/src/kinds';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from "../../../shared-components/header-component/header.component";

@Component({
  selector: 'organizations-details',
  templateUrl: './organization-details.component.html',
  styleUrl: './organization-details.component.scss',
  imports: [CommonModule, FormsModule, HeaderComponent]
})
export class OrganizationDetailsComponent {
  organization = new Organization();
  constructor(
    private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  async ngOnInit() {
    this.organization = await this.xapiService.getOrganizationDetails();
    console.log(this.organization);
  }

  async saveClicked() {
    await this.xapiService.saveOrganization(this.organization);
    this.router.navigateByUrl('/dashboard');
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  cancelChanges() {
    // Implement cancel logic (e.g., reload original data)
  }

  organizationFormValid(): boolean {
    // Implement form validation logic
    return !!this.organization?.name?.trim();
  }
}