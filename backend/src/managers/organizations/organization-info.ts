import { BadRequestError, Organization, RequestContext, ServerError, SitesByCategoryQuery } from "../../../../shared/src/kinds";
import { foodDAO, organizationDAO } from "../../daos/dao-factory";

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

    async searchSitesByCategories(requestContext: RequestContext, sitesbyCategoryQuery: SitesByCategoryQuery) {
        const organizations = (await organizationDAO.getAllOrganizations()).filter(async org => {
            if (!org.name || !org.addressLine1) {
                return false;
            }

            const foods = await foodDAO.getFoodsByOrganizationID(org.id!);
            for (const food of foods) {
                const categories = await foodDAO.getFoodCategoryAssociationsByFoodID(food.id!);
                for (const category of categories) {
                    if (sitesbyCategoryQuery.categoryIDs.includes(category.foodCategoryID!)) {
                        return true;
                    }
                }
            }
            return false;
        });

        return organizations;
    }
}