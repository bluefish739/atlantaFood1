
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