import { HttpClient, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Student, Store, Charity, StoreLocation, CharityLocation, Role } from './kinds';
import { first, firstValueFrom, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authToken = inject(AuthService).getToken();
  const reqWithHeader = authToken ? req.clone({
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
    return await firstValueFrom(this.http.post<StoreLocation>(`/xapi/store-locations/location`, storeLocation));
  }

  public async getAllStoreLocations() {
    return await firstValueFrom(this.http.get<StoreLocation[]>(`/xapi/store-locations/all`));
  }

  public async getStoreLocations(storeID: string) {
    return await firstValueFrom(this.http.get<StoreLocation[]>(`/xapi/stores/` + storeID + `/locations`));
  }

  public async getStoreLocation(id: string) {
    return await firstValueFrom(this.http.get<StoreLocation>(`/xapi/store-locations/location/` + id));
  }

  public async getCharityLocations(charityID: string) {
    return await firstValueFrom(this.http.get<CharityLocation[]>(`/xapi/charities/` + charityID + `/locations`));
  }

  public async saveCharityLocation(charityLocation: CharityLocation) {
    return await firstValueFrom(this.http.post<CharityLocation>(`/xapi/charity-locations/location`, charityLocation));
  }

  public async getCharityLocation(id: string) {
    return await firstValueFrom(this.http.get<CharityLocation>(`/xapi/charity-locations/location/` + id));
  }

  public async getSiteRoles(siteID: string) {
    return [
      {
        id: "qwertyuiop",
        siteID: "whoknowswhere",
        name: "Can Use Flint and Steel",
        description: "Allow use of flint and steel",
        permissions: []
      }
    ];
  }

  public async getRole(roleID: string) {
    return await firstValueFrom(this.http.get<Role>(`/xapi/roles/role`))
  }
}
