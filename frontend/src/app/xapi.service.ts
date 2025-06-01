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
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<Student[]>(`/xapi/students/all`, { headers }));
  }

  public async getAllStores() {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<Store[]>(`/xapi/stores/all`, { headers }));
  }

  public async getStudent(id: string) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<Student>(`/xapi/students/student/` + id, { headers }));
  }

  public async saveStudent(student: Student) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.post<Student>(`/xapi/students/student`, student, { headers }));
  }
  //============================================================================================
  // Store API Requests
  //============================================================================================
  public async getStore(id: string) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<Store>(`/xapi/stores/store/` + id, { headers }));
  }

  public async saveStore(store: Store) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.post<Store>(`/xapi/stores/store`, store, { headers }));
  }

  public async saveStoreLocation(storeLocation: StoreLocation) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.post<StoreLocation>(`/xapi/store-locations/location`, storeLocation, { headers }));
  }

  public async getAllStoreLocations() {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<StoreLocation[]>(`/xapi/store-locations/all`, { headers }));
  }

  public async getStoreLocations(storeID: string) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<StoreLocation[]>(`/xapi/stores/` + storeID + `/locations`, { headers }));
  }

  public async getStoreLocation(id: string) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<StoreLocation>(`/xapi/store-locations/location/` + id, { headers }));
  }
  //============================================================================================
  // Charity API Requests
  //============================================================================================
  public async getAllCharities() {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<Charity[]>(`/xapi/charities/all`, { headers }));
  }

  public async saveCharity(charity: Charity) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.post<Charity>(`/xapi/charities/charity`, charity, { headers }));
  }

  public async getCharity(id: string) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<Charity>(`/xapi/charities/charity/` + id, { headers }));
  }

  public async getCharityLocations(charityID: string) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<CharityLocation[]>(`/xapi/charities/` + charityID + `/locations`, { headers }));
  }

  public async saveCharityLocation(charityLocation: CharityLocation) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.post<CharityLocation>(`/xapi/charity-locations/location`, charityLocation, { headers }));
  }

  public async getCharityLocation(id: string) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<CharityLocation>(`/xapi/charity-locations/location/` + id, { headers }));
  }
  //============================================================================================
  // Role API Requests
  //============================================================================================
  public async getSiteRoles(siteID: string) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<Role[]>(`/xapi/roles/` + siteID + `/list-roles`, { headers }))
  }

  public async getRole(roleID: string) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<Role>(`/xapi/roles/role/` + roleID, { headers }))
  }

  public async saveRole(role: Role) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.post<Role>(`/xapi/roles/role`, role, { headers }));
  }
  //============================================================================================
  // User/Credentials API Requests
  //============================================================================================
  public async getAllSiteUsers(siteID: string) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<User[]>(`/xapi/users/` + siteID + `/list-users`, { headers }));
  }

  public async saveUser(user: User) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.post<User>(`/xapi/users/user`, user, { headers }));
  }

  public async getUser(userID: string) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<User>(`/xapi/users/user/` + userID, { headers }))
  }

  public async submitCreds(username: string, password: string) {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<string>(`/xapi/users/login/` + username + `/` + password, { headers }))
  }

  public async validateSession() {
    const sessionID = sessionAuthenticator.getCookie("sessionID");
    const headers = new HttpHeaders({
      'Authentication': sessionID
    });
    return await firstValueFrom(this.http.get<boolean>(`/xapi/users/validate-session-on-page-load/`, { headers }));
  }
}
