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
import { LoadingSpinnerComponent } from '../../shared-components/loading-spinner-component/loading-spinner.component';

@Component({
    selector: 'messages',
    templateUrl: './messages-component.html',
    styleUrl: './messages-component.scss',
    imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, ReactiveFormsModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatAutocomplete, LoadingSpinnerComponent]
})
export class MessagesComponent {
    organizationsWithActiveChats: Organization[] = [];
    organizationsToSearch: Organization[] = [];
    organizationSearchForm = new FormGroup({
        searchedOrganization: new FormControl('')
    });
    chatSelectForm = new FormGroup({
        selectedChat: new FormControl('')
    });
    selectedOrganization: Organization = new Organization();
    newMessageText = "";
    messages: Message[] = [];
    organizationDetailsProvided = "LOADING";
    messagesLoading = false;

    constructor(private xapiService: XapiService) {
    }

    async ngOnInit() {
        const currentOrganization = await this.xapiService.getOrganizationDetails();
        if (!currentOrganization.name) {
            this.organizationDetailsProvided = "NO";
            return;
        }
        this.organizationDetailsProvided = "YES";
        
        const organizationsChatStatuses = await this.xapiService.getOrganizationsChatStatuses();
        console.log(organizationsChatStatuses)
        this.organizationsWithActiveChats = organizationsChatStatuses.organizationsWithActiveChats;
        this.organizationsToSearch = organizationsChatStatuses.organizationsToSearch;
    }

    /*
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
    }*/

    async selectOrganization(organizationToSelect?: Organization) {
        this.messagesLoading = true;
        const organization = this.organizationsWithActiveChats.find(org => org.name == this.chatSelectForm.value.selectedChat);
        if (!organization) {
            return;
        }
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

        this.organizationsWithActiveChats.unshift(organizationToAdd);
        //this.selectOrganization(organizationToAdd);
        this.organizationsToSearch = this.organizationsToSearch.filter(org => org.name !== organizationToAdd.name);
    }
}