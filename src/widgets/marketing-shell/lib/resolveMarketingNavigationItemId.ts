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
			return MARKETING_NAVIGATION_ITEM_IDS.GUIDE;
		case MARKETING_ROUTES.CONCEPTS:
			return MARKETING_NAVIGATION_ITEM_IDS.CONCEPTS;
		default:
			return null;
	}
};
