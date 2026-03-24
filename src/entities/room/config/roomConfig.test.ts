import { describe, expect, it } from "vitest";

import { ROOM_LIGHT_CONFIG } from "./roomConfig";

describe("ROOM_LIGHT_CONFIG", () => {
	it("exports numeric light settings", () => {
		expect(typeof ROOM_LIGHT_CONFIG.INTENSITY).toBe("number");
		expect(typeof ROOM_LIGHT_CONFIG.DISTANCE).toBe("number");
		expect(typeof ROOM_LIGHT_CONFIG.DECAY).toBe("number");
		expect(typeof ROOM_LIGHT_CONFIG.HEIGHT).toBe("number");
	});

	it("exports a hex color string", () => {
		expect(ROOM_LIGHT_CONFIG.COLOR).toMatch(/^#[0-9a-f]{6}$/i);
	});

	it("has positive intensity and distance", () => {
		expect(ROOM_LIGHT_CONFIG.INTENSITY).toBeGreaterThan(0);
		expect(ROOM_LIGHT_CONFIG.DISTANCE).toBeGreaterThan(0);
	});
});
