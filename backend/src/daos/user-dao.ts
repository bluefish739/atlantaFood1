import { User } from "../shared/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "./data-store-factory";
import { PropertyFilter } from "@google-cloud/datastore";

export class UserDAO {
    static USER_KIND = "User";

    public async getAllUsers(siteID: string) {
        const query = datastore.createQuery(UserDAO.USER_KIND)
            .filter(new PropertyFilter('siteID', '=', siteID));
        const data = await query.run();
        const users = data[0];

        return users as User[];
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
            .filter(new PropertyFilter('userName', '=', username))
            .filter(new PropertyFilter('password', '=', password));
        const data = await query.run();
        const user = data[0][0];

        return user as User;
    }
}