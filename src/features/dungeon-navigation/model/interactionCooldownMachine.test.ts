import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createActor } from "xstate";

import {
	INTERACTION_COOLDOWN_MACHINE_EVENTS,
	INTERACTION_COOLDOWN_MACHINE_STATES,
	INTERACTION_COOLDOWN_MS,
} from "../config";
import { interactionCooldownMachine } from "./interactionCooldownMachine";

describe("interactionCooldownMachine", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("starts in ready state", () => {
		const actor = createActor(interactionCooldownMachine).start();

		expect(actor.getSnapshot().value).toBe(
			INTERACTION_COOLDOWN_MACHINE_STATES.READY,
		);
	});

	it("uses interact cooldown duration and returns to ready", () => {
		const actor = createActor(interactionCooldownMachine).start();

		actor.send({
			type: INTERACTION_COOLDOWN_MACHINE_EVENTS.START_INTERACT,
		});
		expect(actor.getSnapshot().value).toBe(
			INTERACTION_COOLDOWN_MACHINE_STATES.COOLDOWN,
		);

		vi.advanceTimersByTime(INTERACTION_COOLDOWN_MS.INTERACT);
		expect(actor.getSnapshot().value).toBe(
			INTERACTION_COOLDOWN_MACHINE_STATES.READY,
		);
	});

	it("uses attack cooldown duration and returns to ready", () => {
		const actor = createActor(interactionCooldownMachine).start();

		actor.send({
			type: INTERACTION_COOLDOWN_MACHINE_EVENTS.START_ATTACK,
		});
		expect(actor.getSnapshot().value).toBe(
			INTERACTION_COOLDOWN_MACHINE_STATES.COOLDOWN,
		);

		vi.advanceTimersByTime(INTERACTION_COOLDOWN_MS.ATTACK);
		expect(actor.getSnapshot().value).toBe(
			INTERACTION_COOLDOWN_MACHINE_STATES.READY,
		);
	});

	it("resets immediately from cooldown state", () => {
		const actor = createActor(interactionCooldownMachine).start();

		actor.send({
			type: INTERACTION_COOLDOWN_MACHINE_EVENTS.START_INTERACT,
		});
		actor.send({
			type: INTERACTION_COOLDOWN_MACHINE_EVENTS.RESET,
		});

		expect(actor.getSnapshot().value).toBe(
			INTERACTION_COOLDOWN_MACHINE_STATES.READY,
		);
	});
});
