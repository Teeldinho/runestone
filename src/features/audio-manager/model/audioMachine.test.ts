import { describe, expect, it } from "vitest";
import { createActor } from "xstate";

import { AUDIO_EVENTS, AUDIO_MACHINE_STATES } from "../config";

import { audioMachine } from "./audioMachine";

describe("audioMachine", () => {
	it("starts in playing state", () => {
		const audioActor = createActor(audioMachine).start();

		expect(audioActor.getSnapshot().value).toBe(AUDIO_MACHINE_STATES.PLAYING);
	});

	it("transitions between playing and paused", () => {
		const audioActor = createActor(audioMachine).start();

		audioActor.send({
			type: AUDIO_EVENTS.PLAY_REQUESTED,
		});
		expect(audioActor.getSnapshot().value).toBe(AUDIO_MACHINE_STATES.PLAYING);

		audioActor.send({
			type: AUDIO_EVENTS.PAUSE_REQUESTED,
		});
		expect(audioActor.getSnapshot().value).toBe(AUDIO_MACHINE_STATES.PAUSED);
	});

	it("restores previous audible state after unmuting", () => {
		const audioActor = createActor(audioMachine).start();

		audioActor.send({
			type: AUDIO_EVENTS.MUTE_REQUESTED,
		});

		expect(audioActor.getSnapshot().value).toBe(AUDIO_MACHINE_STATES.MUTED);

		audioActor.send({
			type: AUDIO_EVENTS.UNMUTE_REQUESTED,
		});

		expect(audioActor.getSnapshot().value).toBe(AUDIO_MACHINE_STATES.PLAYING);
	});
});
