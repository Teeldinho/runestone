import { describe, expect, it } from "vitest";

import { AUDIO_MACHINE_STATES } from "../config";

import { checkWasPlaying } from "./audioMachineGuards";

describe("checkWasPlaying", () => {
	it("returns true when lastAudibleState is playing", () => {
		expect(checkWasPlaying(AUDIO_MACHINE_STATES.PLAYING)).toBe(true);
	});

	it("returns false when lastAudibleState is paused", () => {
		expect(checkWasPlaying(AUDIO_MACHINE_STATES.PAUSED)).toBe(false);
	});

	it("returns false when lastAudibleState is muted", () => {
		expect(checkWasPlaying(AUDIO_MACHINE_STATES.MUTED)).toBe(false);
	});
});
