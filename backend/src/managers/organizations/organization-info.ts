import { BadRequestError, Organization, RequestContext, ServerError, SitesByCategoryQuery, SitesByCategoryQueryResponse } from "../../../../shared/src/kinds";
import { foodDAO, organizationDAO } from "../../daos/dao-factory";
// import * as logger from "firebase-functions/logger";

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
        const finalOrganizations: Organization[] = [];
        for (const org of availableOrganizations) {
            const inventorySummary = await foodDAO.getInventorySummaryByOrganizationID(org.id!);
            const inventoryEmpty = inventorySummary.categoryCounts.every(categoryCount => {
                return categoryCount.quantity === 0;
            });
            if (inventoryEmpty) {
                continue;
            }
            if (sitesbyCategoryQuery.categoryIDs.length === 0) {
                finalOrganizations.push(org);
                continue;
            }
            for (const categoryCount of inventorySummary.categoryCounts) {
                if (sitesbyCategoryQuery.categoryIDs.includes(categoryCount.categoryID!) &&
                    categoryCount.quantity! > 0) {
                    finalOrganizations.push(org);
                    break;
                }
            }
            
        }
        finalOrganizations.sort((a, b) => a.name!.localeCompare(b.name!));

        const maxSitesPerPage = 1;
        const organizationsMatchingQuery = finalOrganizations.slice(
            (sitesbyCategoryQuery.pageNumber - 1) * maxSitesPerPage,
            sitesbyCategoryQuery.pageNumber * maxSitesPerPage
        );

        const searchSitesByCategoriesResponse = new SitesByCategoryQueryResponse();
        searchSitesByCategoriesResponse.organizations = organizationsMatchingQuery;
        searchSitesByCategoriesResponse.totalPages = Math.ceil(finalOrganizations.length / maxSitesPerPage);
        return searchSitesByCategoriesResponse;
    }
}