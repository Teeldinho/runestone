import { describe, expect, it } from "vitest";

import {
	MARKETING_FOOTER_LINKS,
	MARKETING_NAVIGATION_ITEM_IDS,
	MARKETING_NAVIGATION_ITEMS,
} from "../config";
import { createMarketingNavigationViewModel } from "./createMarketingNavigationViewModel";

describe("createMarketingNavigationViewModel", () => {
	it("marks the active navigation item", () => {
		const viewModel = createMarketingNavigationViewModel({
			activeNavigationItemId: MARKETING_NAVIGATION_ITEM_IDS.FIELD_GUIDE,
			footerLinks: MARKETING_FOOTER_LINKS,
			navigationItems: MARKETING_NAVIGATION_ITEMS,
		});

		expect(
			viewModel.navigationItems.find(
				(item) => item.id === MARKETING_NAVIGATION_ITEM_IDS.FIELD_GUIDE,
			)?.isActive,
		).toBe(true);
		expect(
			viewModel.navigationItems.find(
				(item) => item.id === MARKETING_NAVIGATION_ITEM_IDS.HOW_IT_WORKS,
			)?.isActive,
		).toBe(false);
	});

	it("leaves all navigation items inactive when active item is null", () => {
		const viewModel = createMarketingNavigationViewModel({
			activeNavigationItemId: null,
			footerLinks: MARKETING_FOOTER_LINKS,
			navigationItems: MARKETING_NAVIGATION_ITEMS,
		});

		expect(viewModel.navigationItems.every((item) => !item.isActive)).toBe(
			true,
		);
	});
});
