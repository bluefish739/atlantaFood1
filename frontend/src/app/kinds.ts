
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
    state: string | undefined;
    city: string | undefined;
    streetName: string | undefined;
    streetNumber: number | undefined;
}

export class Charity {
    id: string | undefined;
    name: string | undefined;
    contact: string | undefined;
}