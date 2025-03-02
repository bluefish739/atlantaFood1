import { HttpClient, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Student } from './kinds';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authToken = inject(AuthService).getToken();
  const reqWithHeader = authToken? req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + authToken),
  }) : req;
  console.log('Request url ' + req.url);
  return next(reqWithHeader);
}

@Injectable({
  providedIn: 'root'
})
export class XapiService {

  constructor(private http: HttpClient) { }

  public async getAllStudents() {
    return await firstValueFrom(this.http.get<Student[]>(`/xapi/students/all`));
  }

  public async getStudent(id: string) {
    return await firstValueFrom(this.http.get<Student>(`/xapi/students/student/` + id));
  }  

  public async saveStudent(student: Student) {
    return await firstValueFrom(this.http.post<Student>(`/xapi/students/student`, student));
  }  
}
