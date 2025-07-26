import { Charity, CharityEmployee } from "../shared/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "./data-store-factory";
import { UserDAO } from "./user-dao";
import { PropertyFilter } from "@google-cloud/datastore";
import * as logger from "firebase-functions/logger";

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

    public async getEmployeeRecordByUserID(userID: string): Promise<CharityEmployee> {
        const query = datastore.createQuery(UserDAO.CHARITY_EMPLOYEE_KIND)
            .filter(new PropertyFilter('userID', '=', userID));
        const data = await query.run();
        const record = data[0][0];
        logger.log("getEmployeeRecordByUserID: querying user by ID = ", userID, data);
        return record as any as CharityEmployee;
    }
}