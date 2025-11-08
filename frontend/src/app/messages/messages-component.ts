import { Component } from '@angular/core';
import { XapiService } from '../xapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Message, Organization } from '../../../../shared/src/kinds';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared-components/header-component/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatAutocomplete } from '@angular/material/autocomplete';

@Component({
    selector: 'messages',
    templateUrl: './messages-component.html',
    styleUrl: './messages-component.scss',
    imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, ReactiveFormsModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatAutocomplete]
})
export class MessagesComponent {
    organizations: Organization[] = [];
    selectedOrganization = new Organization();
    organizationSearchForm = new FormGroup({
        searchedOrganization: new FormControl('')
    });
    newMessageText = "";
    messages: Message[] = [];
    constructor(private xapiService: XapiService) {
    }

    async ngOnInit() {
        const currentOrganiztionID = await this.xapiService.getCurrentOrganizationID();
        this.organizations = await this.xapiService.getAllOrganizations();
        this.organizations = this.organizations.filter(org => 
            org.name && 
            org.name.trim() !== "" && 
            org.id !== currentOrganiztionID
        );
    }

    async selectOrganization(organization: Organization) {
        this.messages = [];
        this.selectedOrganization = organization;
        this.messages = await this.xapiService.getMessagesWithOrganization(organization.id!);
    }

    async sendMessage() {
        const message = new Message();
        message.content = this.newMessageText;
        message.receivingOrganization = this.selectedOrganization.id;
        await this.xapiService.sendMessageToOrganization(message);
        this.newMessageText = "";
        this.messages = await this.xapiService.getMessagesWithOrganization(this.selectedOrganization.id!);
    }

    addChat() {
        
    }
}