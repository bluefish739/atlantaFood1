import { VolunteerOrganization, TransportVolunteer } from "../../../shared/src/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "./data-store-factory";
import { PropertyFilter } from "@google-cloud/datastore";

export class VolunteerDAO {
    static VOLUNTEER_KIND = "Volunteer";
    static VOLUNTEER_ORGANIZATION_KIND = "VolunteerOrganization"

    public async saveOrganization(organization: VolunteerOrganization) {
        if (!organization.id) organization.id = generateId();
        const entityKey = datastore.key([VolunteerDAO.VOLUNTEER_ORGANIZATION_KIND, organization.id]);
        const entity = {
            key: entityKey,
            data: organization
        }
        await datastore.save(entity);
        return organization;
    }

    public async saveVolunteer(volunteer: TransportVolunteer) {
        const entityKey = datastore.key([VolunteerDAO.VOLUNTEER_KIND, volunteer.userID!]);
        const entity = {
            key: entityKey,
            data: volunteer
        }
        await datastore.save(entity);
        return volunteer;
    }

    public async getVolunteersByOrganizationID(organizationID: string) {
        const query = datastore.createQuery(VolunteerDAO.VOLUNTEER_KIND)
            .filter(new PropertyFilter('organizationID', '=', organizationID));
        const data = await query.run();
        const [users] = data;
        return users as TransportVolunteer[];
    }

    public async getEmployeeRecordByUserID(userID: string) {
        const query = datastore.createQuery(VolunteerDAO.VOLUNTEER_KIND)
            .filter(new PropertyFilter('userID', '=', userID));
        const data = await query.run();
        const record = data[0][0];
        return record as any as TransportVolunteer;
    }
}