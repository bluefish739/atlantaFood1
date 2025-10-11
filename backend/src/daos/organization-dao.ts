import { Organization, OrganizationEmployee } from "../../../shared/src/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "./data-store-factory";
import { PropertyFilter } from "@google-cloud/datastore";

export class OrganizationDAO {
    static ORGANIZATION_KIND = "Organization";
    static ORGANIZATION_EMPLOYEE_KIND = "OrganizationEmployee";

    public async getAllOrganizations() {
        const query = datastore.createQuery(OrganizationDAO.ORGANIZATION_KIND);
        const data = await query.run();
        const organizations = data[0];
        return organizations as Organization[];
    }

    public async saveOrganization(organization: Organization) {
        if (!organization.id) organization.id = generateId();
        const entityKey = datastore.key([OrganizationDAO.ORGANIZATION_KIND, organization.id]);
        const entity = {
            key: entityKey,
            data: organization
        }
        await datastore.save(entity);
        return organization;
    }

    public async getOrganization(organizationID: string) {
        const entityKey = datastore.key([OrganizationDAO.ORGANIZATION_KIND, organizationID])
        const data = await datastore.get(entityKey);
        const organization = data[0];
        return organization;
    }

    public async getEmployeeRecordByUserID(userID: string) {
        const query = datastore.createQuery(OrganizationDAO.ORGANIZATION_EMPLOYEE_KIND)
            .filter(new PropertyFilter('userID', '=', userID));
        const data = await query.run();
        const record = data[0][0];
        return record as any as OrganizationEmployee;
    }

    public async getEmployeesByOrganizationID(organizationID: string) {
        const query = datastore.createQuery(OrganizationDAO.ORGANIZATION_EMPLOYEE_KIND)
            .filter(new PropertyFilter('id', '=', organizationID));
        const data = await query.run();
        const [users] = data;
        return users as OrganizationEmployee[];
    }

    public async saveOrganizationEmployee(employee: OrganizationEmployee) {
        const entityKey = datastore.key([OrganizationDAO.ORGANIZATION_EMPLOYEE_KIND, employee.userID!]);
        const entity = {
            key: entityKey,
            data: employee
        };

        await datastore.save(entity);
        return employee;
    }
}