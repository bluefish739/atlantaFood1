import { Component } from '@angular/core';
import { XapiService } from '../../xapi.service';
import { Student } from '../../kinds';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'students-student-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.scss'
})
export class StudentDetailsComponent {
  student= new Student();
  constructor(private xapiService: XapiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if(id && id!='new') {
      this.student = await this.xapiService.getStudent(id);
      if(!this.student) {
        this.student = new Student();
      }
    }
  }

  async saveClicked() {
    await this.xapiService.saveStudent(this.student!);
    this.router.navigateByUrl('/students/list');
  }
}
