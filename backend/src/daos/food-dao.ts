import { Food } from "../../../shared/src/kinds";
import { datastore } from "./data-store-factory";
import { PropertyFilter } from "@google-cloud/datastore";

export class FoodDAO {
    static FOOD_KIND = "FOOD";
    public async getFoodByOrganizationID(organizationID: string) {
        const query = datastore.createQuery(FoodDAO.FOOD_KIND)
            .filter(new PropertyFilter('organizationID', '=', organizationID));
        const data = await query.run();
        const foods = data[0];
        return foods as Food[];
    }
}