import { HttpClient, HttpEvent, HttpHandlerFn, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Organization, Role, User, VerificationResponse, SignupData, GeneralConfirmationResponse, LoginRequest, LoginResponse, DetailedUser, Food, DetailedFood, FoodCategory, InventoryQuery, InventorySummaryRow, CategorySummaryRow, Message, SitesByCategoryQuery, SitesByCategoryQueryResponse, OrganizationChatStatuses, MessagePollRequest } from '../../../shared/src/kinds';
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
    return this.getResponse<Organization[]>(`/xapi/organizations/all`);
  }

  public async saveOrganization(organization: Organization) {
    return this.postResponse<Organization>(`/xapi/organizations/organization`, organization);
  }

  public async getOrganizationDetails() {
    return this.getResponse<Organization>(`/xapi/organizations/organization-details`);
  }

  public async getCurrentOrganizationID() {
    return this.getResponse<string>(`/xapi/organizations//get-current-organization-id`);
  }

  public async searchSitesByCategories(sitesbyCategoryQuery: SitesByCategoryQuery) {
    return this.postResponse<SitesByCategoryQueryResponse>(`/xapi/organizations/search-sites-by-categories`, sitesbyCategoryQuery);
  }
  //============================================================================================
  // Role API Requests
  //============================================================================================
  public async getAllUserRolesOfCurrentOrg() {
    return this.getResponse<Role[]>(`/xapi/roles/list-roles`);
  }

  public async getRole(roleID: string) {
    return this.getResponse<Role>(`/xapi/roles/role/` + roleID);
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
    return this.getResponse<DetailedUser>(`/xapi/users/user-details/${userID}`);
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

  public async getCategorySummaries() {
    return this.getResponse<CategorySummaryRow[]>(`/xapi/food/get-category-summaries`);
  }

  //============================================================================================
  // Messaging API Requests
  //============================================================================================

  public async sendMessageToOrganization(message: Message) {
    return this.postResponse<GeneralConfirmationResponse>(`/xapi/communications/send-message-to-organization`, message);
  }

  public async getMessagesWithOrganization(organizationID: string) {
    return this.getResponse<Message[]>(`/xapi/communications/get-messages-with-organization/` + organizationID);
  }

  public async getOrganizationsChatStatuses() {
    return this.getResponse<OrganizationChatStatuses>(`/xapi/communications/get-chat-statuses`);
  }

  public async getNewMessagesWithOrganization(messagePollRequest: MessagePollRequest) {
    return this.postResponse<Message[]>(`/xapi/communications/get-new-messages-with-organization`, messagePollRequest);
  }
}
