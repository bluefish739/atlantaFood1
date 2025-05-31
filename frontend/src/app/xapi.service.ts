import { HttpClient, HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Student, Store, Charity, StoreLocation, CharityLocation, Role, User } from './kinds';
import { first, firstValueFrom, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { sessionAuthenticator } from './utilities/session-authentication';

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
  //============================================================================================
  // Student API Requests
  //============================================================================================
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
  //============================================================================================
  // Store API Requests
  //============================================================================================
  public async getStore(id: string) {
    return await firstValueFrom(this.http.get<Store>(`/xapi/stores/store/` + id));
  }

  public async saveStore(store: Store) {
    return await firstValueFrom(this.http.post<Store>(`/xapi/stores/store`, store));
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
  //============================================================================================
  // Charity API Requests
  //============================================================================================
  public async getAllCharities() {
    return await firstValueFrom(this.http.get<Charity[]>(`/xapi/charities/all`));
  }

  public async saveCharity(charity: Charity) {
    return await firstValueFrom(this.http.post<Charity>(`/xapi/charities/charity`, charity));
  }

  public async getCharity(id: string) {
    return await firstValueFrom(this.http.get<Charity>(`/xapi/charities/charity/` + id));
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
  //============================================================================================
  // Role API Requests
  //============================================================================================
  public async getSiteRoles(siteID: string) {
    return firstValueFrom(this.http.get<Role[]>(`/xapi/roles/` + siteID + `/list-roles`))
  }

  public async getRole(roleID: string) {
    return await firstValueFrom(this.http.get<Role>(`/xapi/roles/role/` + roleID))
  }

  public async saveRole(role: Role) {
    return await firstValueFrom(this.http.post<Role>(`/xapi/roles/role`, role));
  }
  //============================================================================================
  // User/Credentials API Requests
  //============================================================================================
  public async getAllSiteUsers(siteID: string) {
    //const sessionID = sessionAuthenticator.getCookie("sessionID");
    const sessionID = "aoih";
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<User[]>(`/xapi/users/` + siteID + `/list-users`, { headers }));
  }

  public async saveUser(user: User) {
    return await firstValueFrom(this.http.post<User>(`/xapi/users/user`, user));
  }

  public async getUser(userID: string) {
    return await firstValueFrom(this.http.get<User>(`/xapi/users/user/` + userID))
  }

  public async submitCreds(username: string, password: string) {
    return await firstValueFrom(this.http.get<string>(`/xapi/users/login/` + username + `/` + password))
  }

  public async verifySessionID(sessionID: string) {
    return await firstValueFrom(this.http.get<Boolean>(`/xapi/users/verify-session/` + sessionID));
  }
}
