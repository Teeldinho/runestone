import type {
	MARKETING_FOOTER_LINKS,
	MARKETING_NAVIGATION_ITEMS,
	MarketingNavigationItemId,
} from "../config";

type MarketingNavigationItem = (typeof MARKETING_NAVIGATION_ITEMS)[number];

type MarketingFooterLink = (typeof MARKETING_FOOTER_LINKS)[number];

type CreateMarketingNavigationViewModelInput = {
	activeNavigationItemId: MarketingNavigationItemId | null;
	footerLinks: readonly MarketingFooterLink[];
	navigationItems: readonly MarketingNavigationItem[];
};

type MarketingNavigationLinkViewModel = MarketingNavigationItem & {
	isActive: boolean;
};

type MarketingFooterLinkViewModel = MarketingFooterLink;

type MarketingNavigationViewModel = {
	footerLinks: readonly MarketingFooterLinkViewModel[];
	navigationItems: readonly MarketingNavigationLinkViewModel[];
};

export const createMarketingNavigationViewModel = ({
	activeNavigationItemId,
	footerLinks,
	navigationItems,
}: CreateMarketingNavigationViewModelInput): MarketingNavigationViewModel => {
	return {
		footerLinks,
		navigationItems: navigationItems.map((item) => ({
			...item,
			isActive: item.id === activeNavigationItemId,
		})),
	};
};

export type {
	CreateMarketingNavigationViewModelInput,
	MarketingFooterLinkViewModel,
	MarketingNavigationLinkViewModel,
	MarketingNavigationViewModel,
};
