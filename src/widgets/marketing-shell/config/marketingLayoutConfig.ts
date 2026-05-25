export const MARKETING_LAYOUT_CLASS_NAMES = {
	PAGE_FRAME:
		"mx-auto flex w-full max-w-7xl flex-col gap-9 px-4 py-8 sm:gap-11 sm:px-6 sm:py-10 lg:gap-12 lg:px-8 lg:py-12",
	CONTENT_WIDTH: "max-w-7xl",
	SHELL_BACKGROUND:
		"pointer-events-none absolute inset-0 overflow-hidden bg-background",
	SHELL_GLOW_PRIMARY:
		"absolute -left-24 -top-24 size-96 rounded-full bg-dungeon-gold/10 blur-3xl",
	SHELL_GLOW_ACCENT:
		"absolute right-[-6rem] top-16 size-96 rounded-full bg-dungeon-gold/10 blur-3xl",
	SHELL_GRID:
		"absolute inset-0 bg-[url('/marketing/hex-grid.svg')] bg-[size:120px_104px] opacity-[0.08]",
	SHELL_EDGE_FADE:
		"absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/82 to-transparent",
	SECTION_GAP: "space-y-5",
	SPLIT_GRID: "grid gap-5 lg:grid-cols-[1.1fr_0.9fr]",
	CARD_GRID: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
	CARD_SURFACE: "rounded-lg border border-border bg-card/80 shadow-none ring-0",
	CARD_CONTENT: "p-5 sm:p-6",
	SUBTLE_PANEL: "rounded-lg border border-border bg-card/70 shadow-none ring-0",
	MAJOR_PANEL: "rounded-xl border border-border bg-card/80 shadow-none ring-0",
	CTA_BAND: "rounded-xl border border-border bg-card/70 px-5 py-5 sm:px-6",
	TOKEN_RAIL:
		"flex w-full items-center gap-2 overflow-x-auto border-y border-border bg-card/40 px-4 py-3 backdrop-blur no-scrollbar",
	LIGHT_ROW: "rounded-lg border border-border bg-card/70 transition-colors",
	LIGHT_ROW_INTERACTIVE:
		"rounded-lg border border-border bg-card/70 transition-colors hover:border-dungeon-gold/40 hover:bg-dungeon-gold/5",
	TIMELINE_LIST:
		"relative grid gap-3 rounded-xl border border-border bg-card/50 p-4 sm:p-5",
	TIMELINE_ITEM:
		"relative grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-lg border border-border bg-card/80 px-4 py-4 sm:gap-4 sm:px-5",
	TIMELINE_RAIL: "flex flex-col items-center pt-1",
	TIMELINE_NODE:
		"flex size-8 items-center justify-center rounded-full border border-dungeon-gold/45 bg-dungeon-gold/10 text-[0.7rem] font-bold text-dungeon-gold",
	MAPPING_RAIL:
		"grid gap-3 rounded-xl border border-border bg-card/50 p-4 sm:p-5",
	MAPPING_ROW:
		"grid gap-4 rounded-lg border border-border bg-card/80 p-4 sm:grid-cols-[minmax(0,0.75fr)_auto_minmax(0,1fr)] sm:items-center sm:p-5",
} as const;
