
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
    permissions: {
        permissionName: string,
        enabled: boolean
    }[] = [];
}

export class Permission {
    name: string | undefined;
    description: string | undefined;
}

export class User {
    firstName: string | undefined;
    lastName: string | undefined;
    siteID: string | undefined;
    roles: {
        roleID: string | undefined;
    }[] = [];
}