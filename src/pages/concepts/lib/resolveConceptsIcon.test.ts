import {
	ArrowRightLeft,
	DoorOpen,
	Lock,
	MousePointerClick,
	Package,
	Workflow,
} from "lucide-react";
import { describe, expect, it } from "vitest";

import { CONCEPTS_SECTION_ICON_KEYS } from "../config";
import { resolveConceptsIcon } from "./resolveConceptsIcon";

describe("resolveConceptsIcon", () => {
	it("resolves configured concepts icons", () => {
		expect(resolveConceptsIcon(CONCEPTS_SECTION_ICON_KEYS.STATE)).toBe(
			DoorOpen,
		);
		expect(resolveConceptsIcon(CONCEPTS_SECTION_ICON_KEYS.TRANSITION)).toBe(
			ArrowRightLeft,
		);
		expect(resolveConceptsIcon(CONCEPTS_SECTION_ICON_KEYS.EVENT)).toBe(
			MousePointerClick,
		);
		expect(resolveConceptsIcon(CONCEPTS_SECTION_ICON_KEYS.GUARD)).toBe(Lock);
		expect(resolveConceptsIcon(CONCEPTS_SECTION_ICON_KEYS.CONTEXT)).toBe(
			Package,
		);
		expect(resolveConceptsIcon(CONCEPTS_SECTION_ICON_KEYS.ACTOR)).toBe(
			Workflow,
		);
	});
});
