import { describe, expect, it } from "vitest";

import { formatNearInteractableLabel } from "./formatNearInteractableLabel";

describe("formatNearInteractableLabel", () => {
	it("returns dash when interactable is null", () => {
		expect(formatNearInteractableLabel(null)).toBe("—");
	});

	it("formats door-state key as human-readable label with comma separator", () => {
		expect(formatNearInteractableLabel("library:north")).toBe("Library, North");
		expect(formatNearInteractableLabel("guardRoom:south")).toBe(
			"Guard Room, South",
		);
		expect(formatNearInteractableLabel("entrance:east")).toBe("Entrance, East");
		expect(formatNearInteractableLabel("treasury:west")).toBe("Treasury, West");
	});

	it("formats non-door interactable ids as human-readable labels", () => {
		expect(formatNearInteractableLabel("treasureKey")).toBe("Treasure Key");
	});
});
