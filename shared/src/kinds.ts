
export class Organization {
    id: string | undefined;
    name: string | undefined;
    contact: string | undefined;
    organizationType: string | undefined;
    state: string | undefined;
    city: string | undefined;
    addressLine1: string | undefined;
    addressLine2: string | undefined;
}

export class OrganizationEmployee {
    userID: string | undefined;
    organizationID: string | undefined;
}

export class Role {
    id: string | undefined;
    organizationID: string | undefined;
    name: string | undefined;
    description: string | undefined;
    permissions: string[] = [];
}

export class Permission {
    name: string | undefined;
    description: string | undefined;
}

export class User {
    userID: string | undefined;
    username: string | undefined;
    password: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    phoneNumber: string | undefined;
    userType: "Store" | "Pantry" | "Volunteer" | "Admin" | undefined;
    sessionID: string | undefined;
}

export class DetailedUser {
    user: User | undefined;
    userRoleIDs: string[] = [];
}

export class UserRole {
    userID: string | undefined;
    roleID: string | undefined;
}

export class UserType {
    public static PANTRY = "Pantry";
    public static ADMIN = "Admin";
    public static STORE = "Store";
    public static VOLUNTEER = "Volunteer";
}

export const ADMIN_ROLE_NAME = "ORGANIZATION_ADMIN";

export class Food {
    id: string | undefined;
    name: string | undefined;
    initialQuantity: number | undefined;
    currentQuantity: number | undefined;
    expirationDate: string | undefined; // Format in yyyy-mm-dd
    entryDate: Date | undefined;
    organizationID: string | undefined;
    units: string | undefined;
}

export class DetailedFood {
    food: Food | undefined;
    categoryIDs: string[] = [];
}

export class FoodCategoryAssociation {
    foodID: string | undefined;
    foodCategoryID: string | undefined;
}

export class InventoryQuery {
    categoryIDs: string[] = [];
}

export class FoodCategory {
    id: string | undefined;
    name: string | undefined;
}

export class SitesByCategoryQuery {
    categoryIDs: string[] = [];
    pageNumber: number = 1;
}

export class SitesByCategoryQueryResponse {
    organizations: Organization[] = [];
    totalPages: number | undefined;
}

export class VerificationResponse {
    hasSession: boolean | undefined;
}

export class SignupData {
    username: string | undefined;
    password: string | undefined;
    userType: "Store" | "Pantry" | "Volunteer" | "Admin" | undefined;
}

export class SignupResponse {
    success: boolean | undefined;
    message: string | undefined;
    sessionID: string | undefined; // Only use if success is true
}

export class LoginRequest {
    username: string | undefined;
    password: string | undefined;
}

export class LoginResponse {
    success: boolean | undefined;
    message: string | undefined;
    // Only use if success is true
    sessionID: string | undefined;
    userID: string | undefined;
    userType: string | undefined;
}

export class GeneralConfirmationResponse {
    success: boolean | undefined;
    message: string | undefined;
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
    }
}

export class ServerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ServerError";
    }
}

export class RequestContext {
    private req: any;
    constructor(req: any) {
        this.req = req;
    }

    public getCurrentUser(): User | undefined {
        return (this.req).user;
    }

    public getCurrentOrganizationID(): string | undefined {
        return (this.req).organizationID;
    }
}

export class InventorySummaryRow {
    categoryName: string | undefined;
    quantitySummary: string | undefined;
}

export class CategorySummaryRow {
    category: string | undefined;
    quantitySummary: string | undefined;
    organization: string | undefined;
}

export class Message {
    id: string | undefined;
    sendingOrganization: string | undefined;
    receivingOrganization: string | undefined;
    chatIdentifier: string | undefined;
    content: string | undefined;
    timestamp: Date | undefined;
}

export class OrganizationChatStatuses {
    organizationsWithActiveChats: Organization[] = [];
    organizationsToSearch: Organization[] = [];
}

export class ChatSummary {
    chatIdentifier: string | undefined;
    lastMessageTimestamp: Date | undefined;
}