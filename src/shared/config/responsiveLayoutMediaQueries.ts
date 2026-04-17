export const RESPONSIVE_LAYOUT_MEDIA_QUERIES = {
	DESKTOP_MIN_WIDTH: "(min-width: 1024px)",
	MOBILE_MAX_WIDTH: "(max-width: 767px)",
	TABLET_STANDARD_WIDTH: "(min-width: 768px) and (max-width: 1023px)",
	TABLET_COARSE_WIDTH:
		"(min-width: 1024px) and (max-width: 1366px) and (pointer: coarse)",
	LANDSCAPE: "(orientation: landscape)",
} as const;
