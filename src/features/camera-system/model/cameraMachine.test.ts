import { describe, expect, it } from "vitest";
import { createActor } from "xstate";

import { CAMERA_DEFAULT_MODE, CAMERA_MODES } from "../config/cameraConfig";
import { CAMERA_EVENT_TYPES } from "../config/cameraControlConfig";
import { resolveCameraModeDistance } from "../lib";
import { createCameraMachine } from "./cameraMachine";

describe("cameraMachine", () => {
	it("starts in the default camera mode", () => {
		const machine = createCameraMachine();
		const actor = createActor(machine).start();

		expect(actor.getSnapshot().value).toBe(CAMERA_DEFAULT_MODE);
	});

	it("transitions to thirdPerson on SWITCH_TO_THIRD_PERSON event", () => {
		const machine = createCameraMachine();
		const actor = createActor(machine).start();

		actor.send({ type: "SWITCH_TO_THIRD_PERSON" });

		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.THIRD_PERSON);
		expect(actor.getSnapshot().context.distance).toBe(
			resolveCameraModeDistance(CAMERA_MODES.THIRD_PERSON),
		);
	});

	it("transitions to topDown on SWITCH_TO_TOP_DOWN event", () => {
		const machine = createCameraMachine();
		const actor = createActor(machine).start();

		actor.send({ type: "SWITCH_TO_TOP_DOWN" });

		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.TOP_DOWN);
		expect(actor.getSnapshot().context.distance).toBe(
			resolveCameraModeDistance(CAMERA_MODES.TOP_DOWN),
		);
	});

	it("transitions to firstPerson on SWITCH_TO_FIRST_PERSON event", () => {
		const machine = createCameraMachine();
		const actor = createActor(machine).start();

		actor.send({ type: "SWITCH_TO_FIRST_PERSON" });

		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.FIRST_PERSON);
		expect(actor.getSnapshot().context.distance).toBe(
			resolveCameraModeDistance(CAMERA_MODES.FIRST_PERSON),
		);
	});

	it("transitions to freeOrbital on SWITCH_TO_FREE_ORBITAL event", () => {
		const machine = createCameraMachine();
		const actor = createActor(machine).start();

		// First switch to another mode
		actor.send({ type: "SWITCH_TO_THIRD_PERSON" });
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.THIRD_PERSON);

		// Then switch back to freeOrbital
		actor.send({ type: "SWITCH_TO_FREE_ORBITAL" });
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.FREE_ORBITAL);
		expect(actor.getSnapshot().context.distance).toBe(
			resolveCameraModeDistance(CAMERA_MODES.FREE_ORBITAL),
		);
	});

	it("supports hotkey events for mode switching", () => {
		const machine = createCameraMachine();
		const actor = createActor(machine).start();

		// Hotkey 1 → thirdPerson
		actor.send({ type: "HOTKEY", hotkey: "1" });
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.THIRD_PERSON);

		// Hotkey 2 → topDown
		actor.send({ type: "HOTKEY", hotkey: "2" });
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.TOP_DOWN);

		// Hotkey 3 → firstPerson
		actor.send({ type: "HOTKEY", hotkey: "3" });
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.FIRST_PERSON);

		// Hotkey 4 → freeOrbital
		actor.send({ type: "HOTKEY", hotkey: "4" });
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.FREE_ORBITAL);
	});

	it("allows any-to-any mode transitions", () => {
		const machine = createCameraMachine();
		const actor = createActor(machine).start();

		// Start at default mode
		expect(actor.getSnapshot().value).toBe(CAMERA_DEFAULT_MODE);

		// Jump to firstPerson
		actor.send({ type: "SWITCH_TO_FIRST_PERSON" });
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.FIRST_PERSON);

		// Jump directly to topDown (skipping thirdPerson)
		actor.send({ type: "SWITCH_TO_TOP_DOWN" });
		expect(actor.getSnapshot().value).toBe(CAMERA_MODES.TOP_DOWN);
	});

	it("updates yaw and pitch on LOOK_CHANGED", () => {
		const machine = createCameraMachine();
		const actor = createActor(machine).start();

		actor.send({
			type: CAMERA_EVENT_TYPES.LOOK_CHANGED,
			delta: { x: 2, y: -3 },
		});

		expect(actor.getSnapshot().context.yaw).not.toBe(0);
		expect(actor.getSnapshot().context.pitch).not.toBe(0);
	});
});
