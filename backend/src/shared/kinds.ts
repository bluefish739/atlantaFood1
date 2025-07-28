
export class Store {
    id: string | undefined;
    name: string | undefined;
    contact: string | undefined;
    locations: StoreLocation[] = [];
}

export class StoreLocation {
    id: string | undefined;
    state: string | undefined;
    city: string | undefined;
    streetName: string | undefined;
    streetNumber: number | undefined;
    storeID: string | undefined;
    inventory: {
        foodID: string;
        units: number;
    }[] = [];
}

export class Charity {
    id: string | undefined;
    name: string | undefined;
    contact: string | undefined;
    locations: CharityLocation[] = [];
}

export class CharityLocation {
    id: string | undefined;
    state: string | undefined;
    city: string | undefined;
    streetName: string | undefined;
    streetNumber: number | undefined;
    charityID: string | undefined;
    inventory: {
        foodID: string | undefined;
        units: number | undefined;
        expirationDate: string | undefined;
        source: string | undefined;
    }[] = [];
}

export class Role {
    id: string | undefined;
    organizationID: string | undefined;
    name: string | undefined;
    description: string | undefined;
    permissions: string[] = [];
}

export class User {
    userID: string | undefined;
    username: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    phoneNumber: string | undefined;
    password: string | undefined;
    sessionID: string | undefined;
    userType: "Store" | "Pantry" | "Volunteer" | "Admin" | undefined;
}

export class Food {
    foodID: string | undefined;
    name: string | undefined;
    categories: string[] = [];
}

export class FoodCategory {
    foodCateogryID: string | undefined;
    name: string | undefined;
}

export class SignupData {
    username: string | undefined;
    password: string | undefined;
    userType: "Store" | "Pantry" | "Volunteer" | "Admin" | undefined;
}

export class SignupResponse {
    success: boolean | undefined;
    message: string | undefined;
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

export class InventoryEntry {
    foodName: string | undefined;
    units: number | undefined;
    expirationDate: Date | undefined;
    source: string | undefined;
    tags: string[] = [];
}

export class StoreEmployee {
    userID: string | undefined;
    organizationID: string | undefined;
}

export class CharityEmployee {
    userID: string | undefined;
    organizationID: string | undefined;
}

export class UserRole {
    userID: string | undefined;
    roleID: string | undefined;
}

export const ADMIN_ROLE_NAME = "ORGANIZATION_ADMIN";

export class VolunteerOrganization {
    id: string | undefined;
    name: string | undefined;
}

export class TransportVolunteer {
    userID: string | undefined;
    organizationID: string | undefined;
}

export class Permission {
    name: string | undefined;
    description: string | undefined;
}