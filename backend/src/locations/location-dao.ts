import { Datastore } from "@google-cloud/datastore";
import { StoreLocation, Charity, CharityLocation } from "../shared/kinds";
import { generateId } from "../shared/idutilities";
import { entity } from "@google-cloud/datastore/build/src/entity";

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