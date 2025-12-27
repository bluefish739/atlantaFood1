import { Component } from '@angular/core';
import { XapiService } from '../xapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Message, MessagePollRequest, Organization } from '../../../../shared/src/kinds';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared-components/header-component/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { LoadingSpinnerComponent } from '../../shared-components/loading-spinner-component/loading-spinner.component';
import { last } from 'rxjs';

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
    loading = "LOADING";
    no = "NO";
    yes = "YES";
    organizationDetailsProvided = this.loading;
    messagesLoading = false;

    constructor(private xapiService: XapiService) {
    }

    async ngOnInit() {
        const currentOrganization = await this.xapiService.getOrganizationDetails();
        if (!currentOrganization.name) {
            this.organizationDetailsProvided = this.no;
            return;
        }
        this.organizationDetailsProvided = this.yes;
        
        const organizationsChatStatuses = await this.xapiService.getOrganizationsChatStatuses();
        console.log(organizationsChatStatuses)
        this.organizationsWithActiveChats = organizationsChatStatuses.organizationsWithActiveChats;
        this.organizationsToSearch = organizationsChatStatuses.organizationsToSearch;
        this.startPolling();
    }

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
        this.chatSelectForm.value.selectedChat = organizationToAdd.name;
        this.selectOrganization();
        this.organizationsToSearch = this.organizationsToSearch.filter(org => org.name !== organizationToAdd.name);
    }

    async startPolling() {
        setInterval(async () => {
            if (this.selectedOrganization.id) {
                const messagePollRequest = new MessagePollRequest();
                messagePollRequest.otherOrganizationID = this.selectedOrganization.id;
                messagePollRequest.lastMessageTimestamp = this.messages.length > 0 ? this.messages[this.messages.length - 1].timestamp! : new Date(1);
                const update = await this.xapiService.getNewMessagesWithOrganization(messagePollRequest);
                if (update.length > 0) this.messages = this.messages.concat(update);
            }
        }, 5000);
    }
}