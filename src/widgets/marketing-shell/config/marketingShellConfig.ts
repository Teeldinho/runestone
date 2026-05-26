export const MARKETING_NAVIGATION_ITEM_IDS = {
	GUIDE: "guide",
	CONCEPTS: "concepts",
} as const;

export type MarketingNavigationItemId =
	(typeof MARKETING_NAVIGATION_ITEM_IDS)[keyof typeof MARKETING_NAVIGATION_ITEM_IDS];

export const MARKETING_ROUTES = {
	HOME: "/",
	GAME: "/game",
	GUIDE: "/tutorial",
	CONCEPTS: "/concepts",
	GITHUB_REPOSITORY: "https://github.com/Teeldinho/runestone",
} as const;

export const MARKETING_SHELL_COPY = {
	BRAND_NAME: "RUNESTONE",
	BRAND_RUNE_SEGMENT: "RUNE",
	BRAND_STONE_SEGMENT: "STONE",
	COMPACT_BRAND_RUNE_SEGMENT: "R",
	COMPACT_BRAND_STONE_SEGMENT: "S",
	ENTER_DUNGEON_LABEL: "Enter Dungeon",
	NAVIGATION_SHEET_TITLE: "Runestone",
	NAVIGATION_SHEET_DESCRIPTION: "Navigate the playable architecture guide.",
	FOOTER_COPYRIGHT: "© 2026 Runestone",
	FOOTER_TAGLINE: "Playable architecture",
	GITHUB_LABEL: "GitHub",
	OPEN_NAVIGATION_LABEL: "Open navigation",
} as const;

export const MARKETING_NAVIGATION_ITEMS = [
	{
		id: MARKETING_NAVIGATION_ITEM_IDS.GUIDE,
		label: "Guide",
		to: MARKETING_ROUTES.GUIDE,
	},
	{
		id: MARKETING_NAVIGATION_ITEM_IDS.CONCEPTS,
		label: "Concepts",
		to: MARKETING_ROUTES.CONCEPTS,
	},
] as const;

export const MARKETING_FOOTER_LINKS = [
	{
		label: "Guide",
		to: MARKETING_ROUTES.GUIDE,
		type: "internal",
	},
	{
		label: "Concepts",
		to: MARKETING_ROUTES.CONCEPTS,
		type: "internal",
	},
	{
		label: "GitHub",
		to: MARKETING_ROUTES.GITHUB_REPOSITORY,
		type: "external",
	},
] as const;
