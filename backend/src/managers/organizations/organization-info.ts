import { BadRequestError, Organization, RequestContext, ServerError } from "../../../../shared/src/kinds";
import { organizationDAO } from "../../daos/dao-factory";

export class OrganizationInfoManager {
    async getOrganizationDetails(requestContext: RequestContext) {
        const organizationID = requestContext.getCurrentOrganizationID()!;
        if (!organizationID) {
            throw new BadRequestError("No organizationID found");
        }
        const organization = await organizationDAO.getOrganization(organizationID);
        if (!organization) {
            throw new ServerError("No organization found with organizationID=" + organizationID);
        }
        organization.id = "";
        // Prevent sending sensitive info
        return organization;
    }

    async saveOrganization(requestContext: RequestContext, organization: Organization) {
        if (!organization) {
            throw new BadRequestError("Organization entity is not provided");
        }
        organization.id = requestContext.getCurrentOrganizationID();
        await organizationDAO.saveOrganization(organization);
        return organization;
    }

    async getCurrentOrganizationID(requestContext: RequestContext) {
        return requestContext.getCurrentOrganizationID();
    }
}