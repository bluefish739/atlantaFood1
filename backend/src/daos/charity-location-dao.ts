import { CharityLocation } from "../shared/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "./data-store-factory";
import { PropertyFilter } from "@google-cloud/datastore";


export class CharityLocationDAO {
    static LOCATION_KIND = "charityLocation";
    public async saveLocation(location: CharityLocation) {
        if (!location.id) {
            location.id = generateId();
        }
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

    public async getCharityLocationsByCharityID(charityID: string) {
        const query = datastore.createQuery(CharityLocationDAO.LOCATION_KIND)
            .filter(new PropertyFilter('charityID', '=', charityID));
        const data = await query.run();
        const locations: CharityLocation[] = data[0];
        return locations;
    }

    public async getCharityLocation(charityLocationID: string) {
        const entityKey = datastore.key([CharityLocationDAO.LOCATION_KIND, charityLocationID]);
        const data = await datastore.get(entityKey);
        const charityLocation = data[0];
        return charityLocation;
    }
}