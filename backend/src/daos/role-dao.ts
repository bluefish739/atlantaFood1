import { Role } from "../shared/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "./data-store-factory";
import { PropertyFilter } from "@google-cloud/datastore";

export class RoleDAO {
    static ROLE_KIND = "Role";

    public async getAllRolesBySiteID(siteID: string) {
        const query = datastore.createQuery(RoleDAO.ROLE_KIND)
            .filter(new PropertyFilter('siteID', '=', siteID));;
        const data = await query.run();
        const roles = data[0];
        return roles as Role[];
    }

    public async saveRole(role: Role) {
        if (!role.id) role.id = generateId();
        const entityKey = datastore.key([RoleDAO.ROLE_KIND, role.id]);
        const entity = {
            key: entityKey,
            data: role
        }
        await datastore.save(entity);
        return role;
    }

    public async getRole(roleID: string) {
        const entityKey = datastore.key([RoleDAO.ROLE_KIND, roleID])
        const data = await datastore.get(entityKey);
        const role = data[0];
        return role;
    }
}