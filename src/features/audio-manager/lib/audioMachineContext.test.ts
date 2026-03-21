import { describe, expect, it } from "vitest";

import { AUDIO_MACHINE_STATES } from "../config";

import {
	createMutedAudioContext,
	createUnmutedAudioContext,
} from "./audioMachineContext";

describe("audioMachineContext", () => {
	it("creates muted context with preserved playing audible state", () => {
		const mutedContext = createMutedAudioContext({
			lastAudibleState: AUDIO_MACHINE_STATES.PLAYING,
			settings: {
				isMuted: false,
				masterVolume: 0.8,
				musicVolume: 0.55,
				sfxVolume: 0.9,
			},
		});

		expect(mutedContext.settings.isMuted).toBe(true);
		expect(mutedContext.lastAudibleState).toBe(AUDIO_MACHINE_STATES.PLAYING);
	});

	it("creates unmuted settings payload", () => {
		const unmutedContextPatch = createUnmutedAudioContext({
			lastAudibleState: AUDIO_MACHINE_STATES.PAUSED,
			settings: {
				isMuted: true,
				masterVolume: 0.8,
				musicVolume: 0.55,
				sfxVolume: 0.9,
			},
		});

		expect(unmutedContextPatch.settings?.isMuted).toBe(false);
	});
});
