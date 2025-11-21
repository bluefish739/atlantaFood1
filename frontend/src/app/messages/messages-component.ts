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
import { LoadingSpinnerComponent } from '../../shared-components/loading-spinner-component/loading-spinner.component';

@Component({
    selector: 'messages',
    templateUrl: './messages-component.html',
    styleUrl: './messages-component.scss',
    imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, ReactiveFormsModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatAutocomplete, LoadingSpinnerComponent]
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
    chattingOrganizationsLoaded = false;
    messagesLoading = false;

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
        this.sortChatsByTimestamp();
        this.chattingOrganizationsLoaded = true;
    }

    private sortChatsByTimestamp() {
        this.chattingOrganizations.sort((a, b) => {
            const statusA = this.chatStatuses.find(status => status.organizationName === a.name);
            const statusB = this.chatStatuses.find(status => status.organizationName === b.name);
            if (statusA && statusB) {
                const timestampA = new Date(statusA.lastUpdateTimestamp || 0).getTime();
                const timestampB = new Date(statusB.lastUpdateTimestamp || 0).getTime();
                return timestampA - timestampB;
            }
            return 0;
        });
    }

    async selectOrganization(organization: Organization) {
        this.messagesLoading = true;
        this.messages = await this.xapiService.getMessagesWithOrganization(organization.id!);
        this.selectedOrganization = organization;
        this.messagesLoading = false;
    }

    async sendMessage() {
        // TODO: implement poll model
        const message = new Message();
        message.content = this.newMessageText;
        message.receivingOrganization = this.selectedOrganization.id;
        await this.xapiService.sendMessageToOrganization(message);
        this.newMessageText = "";
        this.messages = await this.xapiService.getMessagesWithOrganization(this.selectedOrganization.id!);
    }

    addChat() {
        const organizationToAdd = this.organizationsToSearch.find(org => org.name === this.organizationSearchForm.value.searchedOrganization);
        if (!organizationToAdd) {
            return;
        }

        this.chattingOrganizations.unshift(organizationToAdd);
        this.selectOrganization(organizationToAdd);
        this.organizationsToSearch = this.organizationsToSearch.filter(org => org.name !== organizationToAdd.name);
    }
}