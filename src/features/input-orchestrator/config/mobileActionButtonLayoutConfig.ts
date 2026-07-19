export const MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES = {
	ROOT: "pointer-events-auto flex flex-col gap-2 touch-none select-none",
	BUTTON: "size-11 rounded-full p-0 shadow-lg backdrop-blur-md",
	ICON: "h-5 w-5",
} as const;

export const MOBILE_ACTION_BUTTON_VARIANTS = {
	ACTIVE: "dungeon-gold",
	INACTIVE: "dungeon-outline",
} as const;
