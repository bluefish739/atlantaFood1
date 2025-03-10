import { Datastore } from "@google-cloud/datastore";
import { Charity } from "../shared/kinds";
import { generateId } from "../shared/idutilities";

export const datastore = new Datastore();
export class CharityDAO {
    static CHARITY_KIND = "Charity";

    public async getAllCharities() {
        const query = datastore.createQuery(CharityDAO.CHARITY_KIND);
        const data = await query.run();
        const charities = data[0];
        return charities as Charity[];
    }

    public async saveCharity(charity: Charity) {
        if (!charity.id) charity.id = generateId();
        const entityKey = datastore.key([CharityDAO.CHARITY_KIND, charity.id]);
        const entity = {
            key: entityKey,
            data: charity
        }
        await datastore.save(entity);
        return charity;
    }

    public async getCharity(charityID: string) {
        const entityKey = datastore.key([CharityDAO.CHARITY_KIND, charityID])
        const data = await datastore.get(entityKey);
        const charity = data[0];
        return charity;
    }
}