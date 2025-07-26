import { Role, UserRole } from "../shared/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "./data-store-factory";
import { PropertyFilter } from "@google-cloud/datastore";
import { Permission } from "../shared/kinds";

export class RoleDAO {
    static ROLE_KIND = "Role";
    static USER_ROLE_KIND = "UserRole"

    public async getAllRolesBySiteID(organizationID: string) {
        const query = datastore.createQuery(RoleDAO.ROLE_KIND)
            .filter(new PropertyFilter('organizationID', '=', organizationID));;
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

    public async saveUserRole(userRole: UserRole) {
        const entityKey = datastore.key([RoleDAO.USER_ROLE_KIND, userRole.userID! + "|" + userRole.roleID!]);
        const entity = {
            key: entityKey,
            data: userRole
        }
        await datastore.save(entity);
        return userRole;
    }

    public async getRole(roleID: string) {
        const entityKey = datastore.key([RoleDAO.ROLE_KIND, roleID])
        const data = await datastore.get(entityKey);
        const role = data[0] as Role;
        return role;
    }

    public async getUserRoles(userID: string) {
        const query = datastore.createQuery(RoleDAO.USER_ROLE_KIND)
            .filter(new PropertyFilter('userID', '=', userID));
        const data = await query.run();
        const [userRoles] = data;
        return userRoles as UserRole[];
    }

    readonly allPermissions: Permission[] = [
        {
            name: "Edit Roles",
            description: "Enables user to edit and assign roles for other users"
        },
        {
            name: "Update Transaction Logs",
            description: "Enables user to add, delete, and edit rows to transaction logs"
        },
        {
            name: "Sleeper",
            description: "Sleeps on the job, occasionally"
        },
        {
            name: "Add Users",
            description: "Enables user to edit and assign roles for other users"
        },
        {
            name: "Creative Mode",
            description: "Allows use of flint and steel"
        }
    ]
}