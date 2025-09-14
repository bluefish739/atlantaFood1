import { BadRequestError, RequestContext } from "../../../../shared/src/kinds";
import { foodDAO } from "../../daos/dao-factory";
import { datastore } from "../../daos/data-store-factory";
import { FoodDAO } from "../../daos/food-dao";

export class DeleteFoodManager {
    async deleteFood(requestContext: RequestContext, foodID: string) {
        try {
            await this.validateDeleteRequest(foodID, requestContext.getCurrentOrganizationID()!);
            const foodCategoryAssociations = await foodDAO.getFoodCategoryAssociationsByFoodID(foodID);

            const transaction = datastore.transaction();
            const keys = [
                datastore.key([FoodDAO.FOOD_KIND, foodID])
            ];

            foodCategoryAssociations.forEach(
                foodCategoryAssociation => keys.push(datastore.key([FoodDAO.FOOD_CATEGORY_ASSOCIATION_KIND, foodID + "|" + foodCategoryAssociation.foodCategoryID]))
            );

            await transaction.run();
            transaction.delete(keys);
            await transaction.commit();
        } catch (error: any) {
            throw error;
        }
    }

    async validateDeleteRequest(foodID: string, organizationID: string) {
        const food = await foodDAO.getFoodByID(foodID);
        if (!food) {
            throw new BadRequestError("Food not found");
        }

        if (food.organizationID != organizationID) {
            throw new BadRequestError("Food not owned by user organization");
        }
    }
}