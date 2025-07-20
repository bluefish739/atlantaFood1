
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