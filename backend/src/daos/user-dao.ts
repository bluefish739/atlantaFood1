import { User } from "../shared/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "./data-store-factory";
import { PropertyFilter } from "@google-cloud/datastore";
import { RoleDAO } from "./role-dao";

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

    public async hasPermission(permission: string, sessionID: string) {
        const sessionQuery = datastore.createQuery(UserDAO.USER_KIND)
            .filter(new PropertyFilter('sessionID', '=', sessionID));
        const data = await sessionQuery.run();
        const user = data[0][0] as User;
        for (let roleID of user.roles) {
            const roleQuery = datastore.createQuery(RoleDAO.ROLE_KIND)
                .filter(new PropertyFilter('roleID', '=', roleID));
            const rolesData = await roleQuery.run();
            const rolePermissions = rolesData[0];
            let roleGrantsPerm: boolean = false;
            rolePermissions.forEach((rolePermission) => {
                if (rolePermission === permission) roleGrantsPerm = true;
            });
            if (roleGrantsPerm) return true;
        }
        return false;
    }
}