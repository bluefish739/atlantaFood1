import { BadRequestError, Organization, RequestContext, ServerError, SitesByCategoryQuery, SitesByCategoryQueryResponse } from "../../../../shared/src/kinds";
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
                const inventorySummary = await foodDAO.getInventorySummaryByOrganizationID(org.id!);
                const inventoryEmpty = inventorySummary.categoryCounts.every(categoryCount => {
                    return categoryCount.quantity === 0;
                });
                if (inventoryEmpty) return null;

                if (sitesbyCategoryQuery.categoryIDs.length === 0) return org;
                for (const categoryCount of inventorySummary.categoryCounts) {
                    if (sitesbyCategoryQuery.categoryIDs.includes(categoryCount.categoryID!) &&
                        categoryCount.quantity! > 0) {
                        return org;
                    }
                }
                return null;
            })
        )
        .then(results => results.filter(org => org !== null) as Organization[]);
        const sortedOrganizationsMatchingCategories = organizationsMatchingCategories.sort((a, b) => a.name!.localeCompare(b.name!));

        const maxSitesPerPage = 1;
        const organizationsMatchingQuery = sortedOrganizationsMatchingCategories.filter((_, idx) => 
            idx >= (sitesbyCategoryQuery.pageNumber - 1) * maxSitesPerPage && idx < sitesbyCategoryQuery.pageNumber * maxSitesPerPage
        )

        const searchSitesByCategoriesResponse = new SitesByCategoryQueryResponse();
        searchSitesByCategoriesResponse.organizations = organizationsMatchingQuery;
        searchSitesByCategoriesResponse.totalPages = Math.ceil(organizationsMatchingCategories.length / maxSitesPerPage);
        return searchSitesByCategoriesResponse;
    }
}