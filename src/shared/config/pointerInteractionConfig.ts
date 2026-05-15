export const POINTER_ROLES = {
	MOVEMENT: "movement",
	LOOK: "look",
	ZOOM: "zoom",
	DISCRETE_ACTION: "discreteAction",
} as const;

export type PointerRole = (typeof POINTER_ROLES)[keyof typeof POINTER_ROLES];

export const INPUT_POINTER_DATA_ATTRIBUTES = {
	ROLE: "data-input-pointer-role",
	BLOCKS_LOOK: "data-input-blocks-look",
} as const;

export const INPUT_POINTER_DATA_ATTRIBUTE_VALUES = {
	TRUE: "true",
	FALSE: "false",
} as const;
