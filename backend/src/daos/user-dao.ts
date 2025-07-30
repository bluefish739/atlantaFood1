import { User } from "../../../shared/src/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "./data-store-factory";
import { PropertyFilter } from "@google-cloud/datastore";

export class UserDAO {
    static USER_KIND = "User";

    public async getUsersByUserIDs(userIDs: string[]) {
        // Construct keys for the given IDs
        const keys = userIDs.map(id => datastore.key([UserDAO.USER_KIND, id]));
        // Query Datastore for entities matching the keys
        const [entities] = await datastore.get(keys);

        // Return the found entities (filter out undefined results if some IDs don't exist)
        return entities.filter((entity: User) => entity !== undefined);
    }

    public async getAdminsByOrganizationID(organizationID: string) {
        throw new Error("TODO: Implement this");
    }

    public async saveUser(user: User) {
        if (!user.userID) {
            user.userID = generateId();
        }
        const entityKey = datastore.key([UserDAO.USER_KIND, user.userID]);
        const entity = {
            key: entityKey,
            data: user
        };

        await datastore.save(entity);
        return user;
    }

    public async getUser(userId: string) {
        const entityKey = datastore.key([UserDAO.USER_KIND, userId]);
        const data = await datastore.get(entityKey);
        const user = data[0];
        return user;
    }

    public async verifyUser(username: string, password: string) {
        const query = datastore.createQuery(UserDAO.USER_KIND)
            .filter(new PropertyFilter('username', '=', username))
            .filter(new PropertyFilter('password', '=', password));
        const data = await query.run();
        const user = data[0][0];
        if (user === undefined) {
            return undefined;
        }
        return user as User;
    }

    public async getUserBySessionID(sessionID: string) {
        const query = datastore.createQuery(UserDAO.USER_KIND)
            .filter(new PropertyFilter('sessionID', '=', sessionID));
        const data = await query.run();
        const users = data[0];
        if (users.length > 0) {
            return users[0];
        }
        return null;
    }

    public async usernameTaken(username: string) {
        const query = datastore.createQuery(UserDAO.USER_KIND)
            .filter(new PropertyFilter('username', '=', username));
        const data = await query.run();
        const users = data[0];
        if (users.length > 0) {
            return true;
        }
        return false;
    }
}