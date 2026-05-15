import { describe, expect, it } from "vitest";

import { MOBILE_RUN_CONFIG } from "../config";
import { resolveMobileRunIntent } from "./resolveMobileRunIntent";

describe("resolveMobileRunIntent", () => {
	it("returns false when magnitude is below threshold", () => {
		expect(
			resolveMobileRunIntent({
				magnitude: MOBILE_RUN_CONFIG.RUN_MAGNITUDE_MIN - 0.1,
			}),
		).toBe(false);
	});

	it("returns true when magnitude equals threshold", () => {
		expect(
			resolveMobileRunIntent({
				magnitude: MOBILE_RUN_CONFIG.RUN_MAGNITUDE_MIN,
			}),
		).toBe(true);
	});

	it("returns true when magnitude is above threshold", () => {
		expect(
			resolveMobileRunIntent({
				magnitude: MOBILE_RUN_CONFIG.RUN_MAGNITUDE_MIN + 0.1,
			}),
		).toBe(true);
	});
});
