import { describe, expect, it } from "vitest";
import { createActor } from "xstate";

import { CAMERA_DEFAULT_MODE, CAMERA_EVENTS, CAMERA_MODES } from "../config";
import { createCameraMachine } from "./cameraMachine";

describe("cameraMachine", () => {
	it("starts in the default camera mode", () => {
		const machine = createCameraMachine();
		const actor = createActor(machine).start();

		expect(actor.getSnapshot().value).toBe(CAMERA_DEFAULT_MODE);
		expect(actor.getSnapshot().context).toEqual({});
	});

	it("transitions between camera modes through explicit events", () => {
		const machine = createCameraMachine();
		const actor = createActor(machine).start();

		actor.send({ type: CAMERA_EVENTS.SWITCH_TO_TOP_DOWN });
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.TOP_DOWN);

		actor.send({ type: CAMERA_EVENTS.SWITCH_TO_FIRST_PERSON });
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.FIRST_PERSON);

		actor.send({ type: CAMERA_EVENTS.SWITCH_TO_FREE_ORBITAL });
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.FREE_ORBITAL);
		expect(actor.getSnapshot().context).toEqual({});
	});

	it("maps camera hotkeys to modes without tracking telemetry", () => {
		const machine = createCameraMachine();
		const actor = createActor(machine).start();

		actor.send({
			type: CAMERA_EVENTS.HOTKEY,
			hotkey: "1",
		});
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.THIRD_PERSON);

		actor.send({
			type: CAMERA_EVENTS.HOTKEY,
			hotkey: "2",
		});
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.TOP_DOWN);

		actor.send({
			type: CAMERA_EVENTS.HOTKEY,
			hotkey: "3",
		});
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.FIRST_PERSON);

		actor.send({
			type: CAMERA_EVENTS.HOTKEY,
			hotkey: "4",
		});
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.FREE_ORBITAL);
		expect(actor.getSnapshot().context).toEqual({});
	});
});
