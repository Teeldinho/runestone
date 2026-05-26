import {
	ArrowRightLeft,
	DoorOpen,
	Lock,
	type LucideIcon,
	MousePointerClick,
	Package,
	Workflow,
} from "lucide-react";

import {
	CONCEPTS_SECTION_ICON_KEYS,
	type ConceptsSectionIconKey,
} from "../config";

export const resolveConceptsIcon = (
	iconKey: ConceptsSectionIconKey,
): LucideIcon => {
	switch (iconKey) {
		case CONCEPTS_SECTION_ICON_KEYS.ACTOR:
			return Workflow;
		case CONCEPTS_SECTION_ICON_KEYS.CONTEXT:
			return Package;
		case CONCEPTS_SECTION_ICON_KEYS.EVENT:
			return MousePointerClick;
		case CONCEPTS_SECTION_ICON_KEYS.GUARD:
			return Lock;
		case CONCEPTS_SECTION_ICON_KEYS.STATE:
			return DoorOpen;
		case CONCEPTS_SECTION_ICON_KEYS.TRANSITION:
			return ArrowRightLeft;
	}
};
