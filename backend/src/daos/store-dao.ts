import { PropertyFilter } from "@google-cloud/datastore";
import { Store } from "../../../shared/src/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "./data-store-factory";
import { StoreEmployee } from "../shared/kinds";

export class StoreDAO {
    static STORE_KIND = "Store";
    static STORE_EMPLOYEE_KIND = "StoreEmployee";

    public async getAllStores() {
        const query = datastore.createQuery(StoreDAO.STORE_KIND);
        const data = await query.run();
        const stores = data[0];

        return stores as Store[];
    }

    public async saveStore(store: Store) {
        if (!store.id) {
            store.id = generateId();
        }
        const entityKey = datastore.key([StoreDAO.STORE_KIND, store.id]);
        const entity = {
            key: entityKey,
            data: store
        };

        await datastore.save(entity);
        return store;
    }

    public async getStore(storeId: string) {
        const entityKey = datastore.key([StoreDAO.STORE_KIND, storeId]);
        const data = await datastore.get(entityKey);
        const store = data[0];
        return store;
    }

    public async saveStoreEmployee(employee: StoreEmployee) {
        const entityKey = datastore.key([StoreDAO.STORE_EMPLOYEE_KIND, employee.userID!]);
        const entity = {
            key: entityKey,
            data: employee
        };

        await datastore.save(entity);
        return employee;
    }

    public async getEmployeesOfStoreByOrganizationID(organizationID: string): Promise<StoreEmployee[]> {
        const query = datastore.createQuery(StoreDAO.STORE_EMPLOYEE_KIND)
            .filter(new PropertyFilter('organizationID', '=', organizationID));
        const data = await query.run();
        const users = data[0];
        return users as StoreEmployee[];
    }

    public async getEmployeeRecordByUserID(userID: string) {
        const query = datastore.createQuery(StoreDAO.STORE_EMPLOYEE_KIND)
            .filter(new PropertyFilter('userID', '=', userID));
        const data = await query.run();
        const record = data[0][0];
        return record as any as StoreEmployee;
    }
}