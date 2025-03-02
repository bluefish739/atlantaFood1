import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { Student } from '../../kinds';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'students-student-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent {
  students!: Student[];
  constructor(private xapiService: XapiService) {
  }

  async ngOnInit() {
    this.students = await this.xapiService.getAllStudents();
  }
}
