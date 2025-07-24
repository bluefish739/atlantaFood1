import { VolunteerOrganization, TransportVolunteer } from "../shared/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "./data-store-factory";

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
}