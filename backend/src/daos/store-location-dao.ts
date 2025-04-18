import { StoreLocation } from "../shared/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "./data-store-factory";
import { PropertyFilter } from "@google-cloud/datastore";


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

    public async getStoreLocationsByStoreID(storeID: string) {
        const query = datastore.createQuery(StoreLocationDAO.LOCATION_KIND)
            .filter(new PropertyFilter('storeID', '=', storeID));
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