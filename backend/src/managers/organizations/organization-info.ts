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
        const availableOrganizations = (await organizationDAO.getAllOrganizations()).filter(org => org.name && org.addressLine1);
        const organizationsMatchingCategories = await Promise.all(
            availableOrganizations.map(async org => {
                const foods = await foodDAO.getFoodsByOrganizationID(org.id!);
                if (foods.length === 0) {
                    return null;
                }

                if (sitesbyCategoryQuery.categoryIDs.length === 0) {
                    return org;
                }

                for (const food of foods) {
                    const categories = await foodDAO.getFoodCategoryAssociationsByFoodID(food.id!);
                    for (const category of categories) {
                        if (sitesbyCategoryQuery.categoryIDs.includes(category.foodCategoryID!)) {
                            return org;
                        }
                    }
                }
                return null;
            })
        ).then(results => results.filter(org => org !== null) as Organization[]);

        const maxSitesPerPage = 1;
        const response = organizationsMatchingCategories.filter((_, idx) => 
            idx >= (sitesbyCategoryQuery.pageNumber - 1) * maxSitesPerPage && idx < sitesbyCategoryQuery.pageNumber * maxSitesPerPage
        );
        return response;
    }
}