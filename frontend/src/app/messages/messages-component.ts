import { Component } from '@angular/core';
import { XapiService } from '../xapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatStatus, Message, Organization } from '../../../../shared/src/kinds';
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
    chattingOrganizations: Organization[] = [];
    organizationsToSearch: Organization[] = [];
    selectedOrganization = new Organization();
    organizationSearchForm = new FormGroup({
        searchedOrganization: new FormControl('')
    });
    newMessageText = "";
    messages: Message[] = [];
    chatStatuses: ChatStatus[] = [];
    organizationDetailsProvided = "LOADING";

    constructor(private xapiService: XapiService) {
    }

    async ngOnInit() {
        const currentOrganizationID = await this.xapiService.getCurrentOrganizationID();
        const currentOrganization = await this.xapiService.getOrganizationDetails();
        if (!currentOrganization.name) {
            this.organizationDetailsProvided = "NO";
            return;
        }

        this.organizationDetailsProvided = "YES";
        this.chattingOrganizations = await this.xapiService.getAllOrganizations();
        this.chattingOrganizations = this.chattingOrganizations.filter(org => 
            org.name && 
            org.name.trim() !== "" && 
            org.id !== currentOrganizationID
        );
        await this.updateByChatStatuses();
    }

    async updateByChatStatuses() {
        this.organizationsToSearch = [...this.chattingOrganizations];
        this.chatStatuses = await this.xapiService.getChatStatuses();
        this.chattingOrganizations = this.chattingOrganizations.filter(org => {
            const organizationIndex = this.chatStatuses.findIndex(chatStatus => chatStatus.organizationName == org.name);
            if (organizationIndex >= 0) {
                return this.chatStatuses[organizationIndex].chatStarted;
            }
            return false;
        });
        this.organizationsToSearch = this.organizationsToSearch.filter(org => org.name && !this.chattingOrganizations.find(chatOrg => chatOrg.name === org.name));
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