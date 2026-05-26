import { ChevronsUp, Footprints, Gamepad2 } from "lucide-react";
import { describe, expect, it } from "vitest";

import { TUTORIAL_ICON_KEYS } from "../config";
import { resolveTutorialIcon } from "./resolveTutorialIcon";

describe("resolveTutorialIcon", () => {
	it("resolves configured tutorial icons", () => {
		expect(resolveTutorialIcon(TUTORIAL_ICON_KEYS.GAMEPAD)).toBe(Gamepad2);
		expect(resolveTutorialIcon(TUTORIAL_ICON_KEYS.FOOTPRINTS)).toBe(Footprints);
		expect(resolveTutorialIcon(TUTORIAL_ICON_KEYS.CHEVRONS_UP)).toBe(
			ChevronsUp,
		);
	});
});
