export const MARKETING_NAVIGATION_ITEM_IDS = {
	HOW_IT_WORKS: "how-it-works",
	FIELD_GUIDE: "field-guide",
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
	ENTER_DUNGEON_LABEL: "Enter Floor I",
	NAVIGATION_SHEET_TITLE: "Runestone",
	NAVIGATION_SHEET_DESCRIPTION:
		"Inspect Floor I, the running machine, and its controls.",
	FOOTER_COPYRIGHT: "© 2026 Runestone",
	FOOTER_TAGLINE: "Executable logic, made physical",
	GITHUB_LABEL: "GitHub",
	OPEN_NAVIGATION_LABEL: "Open navigation",
} as const;

export const MARKETING_NAVIGATION_ITEMS = [
	{
		id: MARKETING_NAVIGATION_ITEM_IDS.HOW_IT_WORKS,
		label: "How it works",
		href: "/#how-it-works",
	},
	{
		id: MARKETING_NAVIGATION_ITEM_IDS.FIELD_GUIDE,
		label: "Field guide",
		href: "/#machine",
	},
] as const;

export const MARKETING_FOOTER_LINKS = [
	{
		label: "How it works",
		href: "/#how-it-works",
		type: "anchor",
	},
	{
		label: "The machine",
		href: "/#machine",
		type: "anchor",
	},
	{
		label: "Controls",
		href: "/#controls",
		type: "anchor",
	},
	{
		label: "GitHub",
		href: MARKETING_ROUTES.GITHUB_REPOSITORY,
		type: "external",
	},
] as const;
