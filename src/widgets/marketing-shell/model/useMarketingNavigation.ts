import {
	MARKETING_FOOTER_LINKS,
	MARKETING_NAVIGATION_ITEMS,
	type MarketingNavigationItemId,
} from "../config";
import { createMarketingNavigationViewModel } from "../lib";

export const useMarketingNavigation = (
	activeNavigationItemId: MarketingNavigationItemId | null,
) => {
	return createMarketingNavigationViewModel({
		activeNavigationItemId,
		footerLinks: MARKETING_FOOTER_LINKS,
		navigationItems: MARKETING_NAVIGATION_ITEMS,
	});
};
