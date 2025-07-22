
export class Student {
    id: string | undefined;
    name: string | undefined;
    email: string | undefined;
    updatedAt: Date | undefined;
}

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
    siteID: string | undefined;
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
    firstName: string | undefined;
    lastName: string | undefined;
    siteID: string | undefined;
    phoneNumber: string | undefined;
    password: string | undefined;
    tokenID: string | undefined;
    roles: string[] = [];
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

export class VerificationResponse {
    hasSession: boolean | undefined;
}

export class SignupData {
    username: string | undefined;
    password: string | undefined;
    userType: string | undefined;
}

export class SignupResponse {
    success: boolean | undefined;
    message: string | undefined;
}

export class InventoryEntry {
    foodName: string | undefined;
    units: number | undefined;
    expirationDate: string | undefined;
    source: string | undefined;
    tags: string[] = [];
}