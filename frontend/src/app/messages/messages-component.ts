import { Component } from '@angular/core';
import { XapiService } from '../xapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'messages',
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.scss',
    imports: [CommonModule, RouterModule]
})
export class MessagesComponent {
    constructor(private xapiService: XapiService) {
    }
}