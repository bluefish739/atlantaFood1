import { StoreLocation, CharityLocation } from "../shared/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "./data-store-factory";

export class StoreLocationDAO {
    static LOCATION_KIND = "storeLocation";
    public async saveLocation(location: StoreLocation) {
        if (!location.id) {
            location.id = generateId();
        }
        const entityKey = datastore.key([StoreLocationDAO.LOCATION_KIND, location.id]);
        const entity = {
            key: entityKey,
            data: location
        };

        await datastore.save(entity);
        return location;
    }

    public async getAllLocations() {
        const query = datastore.createQuery(StoreLocationDAO.LOCATION_KIND);
        const data = await query.run();
        const locations: StoreLocation[] = data[0];
        return locations;
    }

    public async getStoreLocation(storeLocationID: string) {
        const entityKey = datastore.key([StoreLocationDAO.LOCATION_KIND, storeLocationID]);
        const data = await datastore.get(entityKey);
        const storeLocation = data[0];
        return storeLocation;
    }
}

export class CharityLocationDAO {
    static LOCATION_KIND = "charityLocation";
    public async addLocation(location: CharityLocation) {
        location.id = generateId();
        const entityKey = datastore.key([CharityLocationDAO.LOCATION_KIND, location.id]);
        const entity = {
            key: entityKey,
            data: location
        }
        await datastore.save(entity);
        return location;
    }

    public async getAllLocations() {
        const query = datastore.createQuery(CharityLocationDAO.LOCATION_KIND);
        const data = await query.run();
        const locations: CharityLocation[] = data[0];
        return locations;
    }
}