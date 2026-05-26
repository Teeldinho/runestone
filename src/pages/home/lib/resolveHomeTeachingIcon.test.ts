import { DoorOpen, Lock, Package, Workflow } from "lucide-react";
import { describe, expect, it } from "vitest";
import { HOME_TEACHING_ICON_KEYS } from "../config";
import { resolveHomeTeachingIcon } from "./resolveHomeTeachingIcon";

describe("resolveHomeTeachingIcon", () => {
	it("resolves configured teaching icons", () => {
		expect(resolveHomeTeachingIcon(HOME_TEACHING_ICON_KEYS.DOOR_OPEN)).toBe(
			DoorOpen,
		);
		expect(resolveHomeTeachingIcon(HOME_TEACHING_ICON_KEYS.LOCK)).toBe(Lock);
		expect(resolveHomeTeachingIcon(HOME_TEACHING_ICON_KEYS.PACKAGE)).toBe(
			Package,
		);
		expect(resolveHomeTeachingIcon(HOME_TEACHING_ICON_KEYS.WORKFLOW)).toBe(
			Workflow,
		);
	});
});
