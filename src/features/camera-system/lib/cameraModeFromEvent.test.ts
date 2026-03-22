import { describe, expect, it } from "vitest";

import {
	CAMERA_EVENTS,
	CAMERA_HOTKEYS,
	CAMERA_MODES,
} from "@/features/camera-system/config";

import { getCameraModeFromEvent } from "./cameraModeFromEvent";

describe("getCameraModeFromEvent", () => {
	it("returns third-person mode for explicit third-person event", () => {
		expect(
			getCameraModeFromEvent({
				type: CAMERA_EVENTS.SWITCH_TO_THIRD_PERSON,
			}),
		).toBe(CAMERA_MODES.THIRD_PERSON);
	});

	it("returns free-orbital mode for explicit free-orbital event", () => {
		expect(
			getCameraModeFromEvent({
				type: CAMERA_EVENTS.SWITCH_TO_FREE_ORBITAL,
			}),
		).toBe(CAMERA_MODES.FREE_ORBITAL);
	});

	it("resolves a hotkey event to its bound mode", () => {
		expect(
			getCameraModeFromEvent({
				type: CAMERA_EVENTS.HOTKEY,
				hotkey: CAMERA_HOTKEYS.TOP_DOWN,
			}),
		).toBe(CAMERA_MODES.TOP_DOWN);
	});
});
