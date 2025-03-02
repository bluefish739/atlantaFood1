import { Datastore } from "@google-cloud/datastore";
import { StoreLocation } from "../shared/kinds";
import { generateId } from "../shared/idutilities";

const datastore = new Datastore();
export class StoreLocationDAO {
    static LOCATION_KIND = "storeLocation";
    public async addLocation(location: StoreLocation) {
        location.id = generateId();
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
}