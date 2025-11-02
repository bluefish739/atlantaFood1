import { CategorySummaryRow, InventorySummaryRow, RequestContext } from "../../../../shared/src/kinds";
import { organizationDAO } from "../../daos/dao-factory";
//import { getAllFoodCategories } from "../../shared/utilities";
import { getInventoryManager } from "../manager-factory";

export class GetCategorySummariesManager {
    async getCategorySummaries(requestContext: RequestContext): Promise<CategorySummaryRow[]> {
        const organizations = await organizationDAO.getAllOrganizations();
        const inventorySummaries: InventorySummaryRow[][] = await Promise.all(
            organizations.map(async organization => getInventoryManager.getInventorySummary(requestContext, organization.id!))
        );

        const categorySummariesMap = new Map<string, CategorySummaryRow[]>();

        inventorySummaries.forEach((inventorySummary, index) => {
            inventorySummary.forEach(({ quantitySummary, categoryName }) => {
                if (!quantitySummary) return;

                const categorySummary = new CategorySummaryRow();
                categorySummary.organization = organizations[index].name;
                categorySummary.category = categoryName;
                categorySummary.quantitySummary = quantitySummary;

                const categoryGroup = categorySummariesMap.get(categoryName!) || [];
                categoryGroup.push(categorySummary);
                categorySummariesMap.set(categoryName!, categoryGroup);
            });
        });

        return Array.from(categorySummariesMap.values()).flat();
    }
}