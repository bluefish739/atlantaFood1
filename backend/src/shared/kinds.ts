
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
        foodID: string;
        units: number;
    }[] = [];
}

export class Role {
    id: string | undefined;
    siteID: string | undefined;
    name: string | undefined;
    description: string | undefined;
    permissions: string[] = [];
}

export class User {
    userID: string | undefined;
    username: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    siteID: string | undefined;
    phoneNumber: string | undefined;
    password: string | undefined;
    sessionID: string | undefined;
    roles: string[] = [];
    // userType can be one of four strings: pantry, store, and volunteer, and admin
    userType: string | undefined;
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
    userType: string | undefined;
}

export class SignupResponse {
    success: boolean | undefined;
    message: string | undefined;
}