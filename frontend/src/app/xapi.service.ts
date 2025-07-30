import { HttpClient, HttpEvent, HttpHandlerFn, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store, Charity, StoreLocation, CharityLocation, Role, User, VerificationResponse, SignupData, SignupResponse, GeneralConfirmationResponse, LoginRequest, LoginResponse } from '../../../shared/src/kinds';
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

  public buildAuthenticationHeader() {
    const sessionID = sessionAuthenticator.getSessionID();
    return new HttpHeaders({
      'Authentication': sessionID
    });
  }

  getResponse = async <T>(path: string): Promise<T> => {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<T>(path, { headers }));
  };

  postResponse = async <T>(path: string, postData: any): Promise<T> => {
    console.log("postResponse path=" + path, postData);
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.post<T>(path, postData, { headers }));
  };

  deleteResponse = async <T>(path: string): Promise<T> => {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.delete<T>(path, { headers }));
  };
  
  //============================================================================================
  // Store API Requests
  //============================================================================================
  public async getStore(id: string) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<Store>(`/xapi/stores/store/` + id, { headers }));
  }

  public async getAllStores() {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<Store[]>(`/xapi/stores/all`, { headers }));
  }

  public async saveStore(store: Store) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.post<Store>(`/xapi/stores/store`, store, { headers }));
  }

  public async saveStoreLocation(storeLocation: StoreLocation) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.post<StoreLocation>(`/xapi/store-locations/location`, storeLocation, { headers }));
  }

  public async getAllStoreLocations() {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<StoreLocation[]>(`/xapi/store-locations/all`, { headers }));
  }

  public async getStoreLocations(storeID: string) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<StoreLocation[]>(`/xapi/stores/` + storeID + `/locations`, { headers }));
  }

  public async getStoreLocation(id: string) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<StoreLocation>(`/xapi/store-locations/location/` + id, { headers }));
  }
  //============================================================================================
  // Charity API Requests
  //============================================================================================
  public async getAllCharities() {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<Charity[]>(`/xapi/charities/all`, { headers }));
  }

  public async saveCharity(charity: Charity) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.post<Charity>(`/xapi/charities/charity`, charity, { headers }));
  }

  public async getCharity(id: string) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<Charity>(`/xapi/charities/charity/` + id, { headers }));
  }

  public async getCharityLocations(charityID: string) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<CharityLocation[]>(`/xapi/charities/` + charityID + `/locations`, { headers }));
  }

  public async saveCharityLocation(charityLocation: CharityLocation) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.post<CharityLocation>(`/xapi/charity-locations/location`, charityLocation, { headers }));
  }

  public async getCharityLocation(id: string) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<CharityLocation>(`/xapi/charity-locations/location/` + id, { headers }));
  }
  //============================================================================================
  // Role API Requests
  //============================================================================================
  public async getSiteRoles(organizationID: string) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<Role[]>(`/xapi/roles/` + organizationID + `/list-roles`, { headers }))
  }

  public async getRole(roleID: string) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<Role>(`/xapi/roles/role/` + roleID, { headers }))
  }

  public async saveRole(role: Role) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.post<Role>(`/xapi/roles/role`, role, { headers }));
  }
  //============================================================================================
  // User/Credentials API Requests
  //============================================================================================
  public async getAllSiteUsers() {
    return this.getResponse<User[]>(`/xapi/users/list-users`);
  }

  public async saveUser(user: User) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.post<User>(`/xapi/users/user`, user, { headers }));
  }

  public async getUserByID(userID: string) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<User>(`/xapi/users/user/` + userID, { headers }))
  }

  public async login(loginRequest: LoginRequest) {
    return this.postResponse<LoginResponse>(`/xapi/users/login`, loginRequest);
  }

  public async verifyUserBySession() {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<VerificationResponse>(`/xapi/users/verify-user-by-session`, { headers }));
  }

  public async signupUser(signupData: SignupData) {
    return this.postResponse<LoginResponse>(`/xapi/users/signup`, signupData);
  }

  public async removeUserFromSite(userID: string) {
    return this.deleteResponse<GeneralConfirmationResponse>(`/xapi/users/remove-user/${userID}`);
  }
}
