import { HttpClient, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Student, Store, Charity, StoreLocation } from './kinds';
import { first, firstValueFrom, Observable } from 'rxjs';
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

  public async getAllStores() {
    return await firstValueFrom(this.http.get<Store[]>(`/xapi/stores/all`));
  }

  public async getStudent(id: string) {
    return await firstValueFrom(this.http.get<Student>(`/xapi/students/student/` + id));
  }  

  public async saveStudent(student: Student) {
    return await firstValueFrom(this.http.post<Student>(`/xapi/students/student`, student));
  }

  public async getStore(id: string) {
    return await firstValueFrom(this.http.get<Store>(`/xapi/stores/store/` + id));
  }  

  public async saveStore(store: Store) {
    return await firstValueFrom(this.http.post<Store>(`/xapi/stores/store`, store));
  }

  public async getAllCharities() {
    return await firstValueFrom(this.http.get<Charity[]>(`/xapi/charities/all`));
  }

  public async saveCharity(charity: Charity) {
    return await firstValueFrom(this.http.post<Charity>(`/xapi/charities/charity`, charity));
  }

  public async getCharity(id: string) {
    return await firstValueFrom(this.http.get<Charity>(`/xapi/charities/charity/` + id));
  }

  public async saveStoreLocation(storeLocation: StoreLocation) {
    return await firstValueFrom(this.http.post<StoreLocation>(`/xapi/locations/location`, storeLocation));
  }

  public async getAllStoreLocations() {
    return await firstValueFrom(this.http.get<StoreLocation[]>(`/xapi/locations/all`));
  }

  public async getStoreLocation(id: string) {
    return await firstValueFrom(this.http.get<StoreLocation>(`/xapi/locations/location/` + id));
  }  
}
