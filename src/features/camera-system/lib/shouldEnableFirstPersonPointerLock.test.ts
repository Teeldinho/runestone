import { describe, expect, it } from "vitest";

import { CAMERA_MODE_IDS } from "../config";
import { shouldEnableFirstPersonPointerLock } from "./shouldEnableFirstPersonPointerLock";

describe("shouldEnableFirstPersonPointerLock", () => {
	it("enables pointer lock only for desktop first-person mode", () => {
		expect(
			shouldEnableFirstPersonPointerLock({
				isDesktopLayout: true,
				mode: CAMERA_MODE_IDS.FIRST_PERSON,
			}),
		).toBe(true);

		expect(
			shouldEnableFirstPersonPointerLock({
				isDesktopLayout: false,
				mode: CAMERA_MODE_IDS.FIRST_PERSON,
			}),
		).toBe(false);

		expect(
			shouldEnableFirstPersonPointerLock({
				isDesktopLayout: true,
				mode: CAMERA_MODE_IDS.THIRD_PERSON,
			}),
		).toBe(false);
	});
});
