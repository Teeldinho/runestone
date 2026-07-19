import {
	MARKETING_NAVIGATION_ITEM_IDS,
	MARKETING_ROUTES,
	type MarketingNavigationItemId,
} from "../config";

export const resolveMarketingNavigationItemId = (
	pathname: string,
): MarketingNavigationItemId | null => {
	switch (pathname) {
		case MARKETING_ROUTES.GUIDE:
			return MARKETING_NAVIGATION_ITEM_IDS.FIELD_GUIDE;
		case MARKETING_ROUTES.CONCEPTS:
			return MARKETING_NAVIGATION_ITEM_IDS.FIELD_GUIDE;
		default:
			return null;
	}
};
