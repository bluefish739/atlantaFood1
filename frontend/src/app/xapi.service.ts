import { HttpClient, HttpEvent, HttpHandlerFn, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Organization, Role, User, VerificationResponse, SignupData, GeneralConfirmationResponse, LoginRequest, LoginResponse, DetailedUser, Food, DetailedFood, FoodCategory, InventoryQuery, InventorySummaryRow } from '../../../shared/src/kinds';
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

  private getServiceAddress() {
    if(window.location.port=='4200') {
      return 'http://127.0.0.1:5001/atlantafoodhub/us-central1/xapi';
    }
    return ''
  }

  private buildAuthenticationHeader() {
    const sessionID = sessionAuthenticator.getSessionID();
    return new HttpHeaders({
      'Authentication': sessionID
    });
  }

  getResponse = async <T>(path: string): Promise<T> => {
    const headers = this.buildAuthenticationHeader();
    sessionAuthenticator.refreshBrowserCookies();
    return await firstValueFrom(this.http.get<T>(this.getServiceAddress() + path, { headers }));
  };

  postResponse = async <T>(path: string, postData: any): Promise<T> => {
    const headers = this.buildAuthenticationHeader();
    sessionAuthenticator.refreshBrowserCookies();
    return await firstValueFrom(this.http.post<T>(this.getServiceAddress() + path, postData, { headers }));
  };

  deleteResponse = async <T>(path: string): Promise<T> => {
    const headers = this.buildAuthenticationHeader();
    sessionAuthenticator.refreshBrowserCookies();
    return await firstValueFrom(this.http.delete<T>(this.getServiceAddress() + path, { headers }));
  };
  //============================================================================================
  // Organization API Requests
  //============================================================================================
  public async getAllOrganizations() {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<Organization[]>(`/xapi/organizations/all`, { headers }));
  }

  public async saveOrganization(organization: Organization) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.post<Organization>(`/xapi/organizations/organization`, organization, { headers }));
  }

  public async getOrganization(id: string) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<Organization>(`/xapi/organizations/organization/` + id, { headers }));
  }
  //============================================================================================
  // Role API Requests
  //============================================================================================
  public async getAllUserRolesOfCurrentOrg() {
    return this.getResponse<Role[]>(`/xapi/roles/list-roles`);
  }

  public async getRole(roleID: string) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<Role>(`/xapi/roles/role/` + roleID, { headers }))
  }

  public async saveRole(role: Role) {
    return this.postResponse<Role>(`/xapi/roles/role`, role);
  }
  //============================================================================================
  // User/Credentials API Requests
  //============================================================================================
  public async getAllSiteUsers() {
    return this.getResponse<User[]>(`/xapi/users/list-users`);
  }

  public async saveUser(detailedUser: DetailedUser) {
    return this.postResponse<DetailedUser>(`/xapi/users/user`, detailedUser);
  }

  public async getDetailedUserByID(userID: string) {
    const headers = this.buildAuthenticationHeader();
    return await firstValueFrom(this.http.get<DetailedUser>(`/xapi/users/user-details/${userID}`, { headers }))
  }

  public async login(loginRequest: LoginRequest) {
    return this.postResponse<LoginResponse>(`/xapi/users/login`, loginRequest);
  }

  public async verifyUserBySession() {
    return this.getResponse<VerificationResponse>(`/xapi/users/verify-user-by-session`);
  }

  public async signupUser(signupData: SignupData) {
    return this.postResponse<LoginResponse>(`/xapi/users/signup`, signupData);
  }

  public async removeUserFromSite(userID: string) {
    return this.deleteResponse<GeneralConfirmationResponse>(`/xapi/users/remove-user/${userID}`);
  }
  //============================================================================================
  // Food/Inventory API Requests
  //============================================================================================
  public async getInventory(inventoryQuery: InventoryQuery, organizationID: string) {
    return this.postResponse<DetailedFood[]>(`/xapi/food/get-inventory/` + organizationID, inventoryQuery);
  }

  public async saveFood(detailedFood: DetailedFood) {
    return this.postResponse<GeneralConfirmationResponse>(`/xapi/food/post-food`, detailedFood);
  }

  public async getFoodCategories() {
    return this.getResponse<FoodCategory[]>(`/xapi/food/get-food-categories`);
  }

  public async getDetailedFoodByID(foodID: string) {
    return this.getResponse<DetailedFood>(`/xapi/food/get-detailed-food/` + foodID);
  }

  public async deleteFood(foodID: string) {
    return this.deleteResponse<GeneralConfirmationResponse>(`/xapi/food/delete-food/` + foodID);
  }

  public async getInventorySummary(organizationID: string) {
    return this.getResponse<InventorySummaryRow[]>(`/xapi/food/get-inventory-summary/` + organizationID);
  }
}
