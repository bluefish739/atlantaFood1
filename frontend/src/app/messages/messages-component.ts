import { Component } from '@angular/core';
import { XapiService } from '../xapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Message, Organization } from '../../../../shared/src/kinds';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared-components/header-component/header.component';

@Component({
    selector: 'messages',
    templateUrl: './messages-component.html',
    styleUrl: './messages-component.scss',
    imports: [CommonModule, RouterModule, FormsModule, HeaderComponent]
})
export class MessagesComponent {
    organizations: Organization[] = [];
    selectedOrganization = new Organization();
    newMessageText = "";
    messages: Message[] = [];
    constructor(private xapiService: XapiService) {
    }

    async ngOnInit() {
        this.organizations = await this.xapiService.getAllOrganizations();
    }

    selectOrganization(organization: Organization) {
        console.log(organization);
    }

    async sendMessage() {

    }
}