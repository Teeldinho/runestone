import { describe, expect, it } from "vitest";

import { TUTORIAL_ICON_KEYS } from "../config";
import { resolveTutorialIcon } from "./resolveTutorialIcon";

describe("resolveTutorialIcon", () => {
	it("resolves configured tutorial icons", () => {
		expect(resolveTutorialIcon(TUTORIAL_ICON_KEYS.GAMEPAD).name).toBe(
			"Gamepad2",
		);
		expect(resolveTutorialIcon(TUTORIAL_ICON_KEYS.FOOTPRINTS).name).toBe(
			"Footprints",
		);
		expect(resolveTutorialIcon(TUTORIAL_ICON_KEYS.CHEVRONS_UP).name).toBe(
			"ChevronsUp",
		);
	});
});
