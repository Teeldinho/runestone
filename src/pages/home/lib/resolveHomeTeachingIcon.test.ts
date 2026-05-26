import { describe, expect, it } from "vitest";

import { HOME_TEACHING_ICON_KEYS } from "../config";
import { resolveHomeTeachingIcon } from "./resolveHomeTeachingIcon";

describe("resolveHomeTeachingIcon", () => {
	it("resolves configured teaching icons", () => {
		expect(resolveHomeTeachingIcon(HOME_TEACHING_ICON_KEYS.DOOR_OPEN).name).toBe(
			"DoorOpen",
		);
		expect(resolveHomeTeachingIcon(HOME_TEACHING_ICON_KEYS.LOCK).name).toBe(
			"Lock",
		);
		expect(resolveHomeTeachingIcon(HOME_TEACHING_ICON_KEYS.PACKAGE).name).toBe(
			"Package",
		);
		expect(resolveHomeTeachingIcon(HOME_TEACHING_ICON_KEYS.WORKFLOW).name).toBe(
			"Workflow",
		);
	});
});
