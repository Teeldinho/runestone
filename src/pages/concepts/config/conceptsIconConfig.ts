export const CONCEPTS_SECTION_ICON_KEYS = {
	ACTOR: "actor",
	CONTEXT: "context",
	EVENT: "event",
	GUARD: "guard",
	STATE: "state",
	TRANSITION: "transition",
} as const;

export type ConceptsSectionIconKey =
	(typeof CONCEPTS_SECTION_ICON_KEYS)[keyof typeof CONCEPTS_SECTION_ICON_KEYS];
