import { describe, expect, it } from "vitest";

import { MARKETING_NAVIGATION_ITEM_IDS, MARKETING_ROUTES } from "../config";

import { resolveMarketingNavigationItemId } from "./resolveMarketingNavigationItemId";

describe("resolveMarketingNavigationItemId", () => {
	it("resolves the guide navigation item for the tutorial route", () => {
		expect(resolveMarketingNavigationItemId(MARKETING_ROUTES.GUIDE)).toBe(
			MARKETING_NAVIGATION_ITEM_IDS.GUIDE,
		);
	});

	it("resolves the concepts navigation item for the concepts route", () => {
		expect(resolveMarketingNavigationItemId(MARKETING_ROUTES.CONCEPTS)).toBe(
			MARKETING_NAVIGATION_ITEM_IDS.CONCEPTS,
		);
	});

	it("returns null for routes without a marketing navigation item", () => {
		expect(resolveMarketingNavigationItemId(MARKETING_ROUTES.HOME)).toBeNull();
		expect(resolveMarketingNavigationItemId("/unknown")).toBeNull();
	});
});
