import { Datastore } from "@google-cloud/datastore";
import { Store } from "../shared/kinds";
import { generateId } from "../shared/idutilities";

export const datastore = new Datastore();
export class StoreDAO {
    static STORE_KIND = "Store";

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
}