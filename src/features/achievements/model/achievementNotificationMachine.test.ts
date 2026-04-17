import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createActor } from "xstate";

import {
	ACHIEVEMENT_COPY,
	ACHIEVEMENT_DISPLAY_DURATION_MS,
	ACHIEVEMENT_IDS,
	ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS,
	ACHIEVEMENT_NOTIFICATION_MACHINE_STATES,
} from "../config";
import { achievementNotificationMachine } from "./achievementNotificationMachine";

const FIRST_STEPS_ACHIEVEMENT = {
	id: ACHIEVEMENT_IDS.FIRST_STEPS,
	label: ACHIEVEMENT_COPY.FIRST_STEPS.label,
	description: ACHIEVEMENT_COPY.FIRST_STEPS.description,
};

const KEY_HUNTER_ACHIEVEMENT = {
	id: ACHIEVEMENT_IDS.KEY_HUNTER,
	label: ACHIEVEMENT_COPY.KEY_HUNTER.label,
	description: ACHIEVEMENT_COPY.KEY_HUNTER.description,
};

describe("achievementNotificationMachine", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("starts in idle state with no active achievement", () => {
		const actor = createActor(achievementNotificationMachine).start();

		expect(actor.getSnapshot().value).toBe(
			ACHIEVEMENT_NOTIFICATION_MACHINE_STATES.IDLE,
		);
		expect(actor.getSnapshot().context.activeAchievement).toBeNull();
	});

	it("shows achievement when SHOW event is sent", () => {
		const actor = createActor(achievementNotificationMachine).start();

		actor.send({
			type: ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.SHOW,
			achievement: FIRST_STEPS_ACHIEVEMENT,
		});

		expect(actor.getSnapshot().value).toBe(
			ACHIEVEMENT_NOTIFICATION_MACHINE_STATES.SHOWING,
		);
		expect(actor.getSnapshot().context.activeAchievement).toEqual(
			FIRST_STEPS_ACHIEVEMENT,
		);
	});

	it("clears active achievement after configured display duration", () => {
		const actor = createActor(achievementNotificationMachine).start();

		actor.send({
			type: ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.SHOW,
			achievement: FIRST_STEPS_ACHIEVEMENT,
		});
		vi.advanceTimersByTime(ACHIEVEMENT_DISPLAY_DURATION_MS);

		expect(actor.getSnapshot().value).toBe(
			ACHIEVEMENT_NOTIFICATION_MACHINE_STATES.IDLE,
		);
		expect(actor.getSnapshot().context.activeAchievement).toBeNull();
	});

	it("restarts the notification timer when SHOW is sent while already showing", () => {
		const actor = createActor(achievementNotificationMachine).start();

		actor.send({
			type: ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.SHOW,
			achievement: FIRST_STEPS_ACHIEVEMENT,
		});
		vi.advanceTimersByTime(ACHIEVEMENT_DISPLAY_DURATION_MS - 1);

		actor.send({
			type: ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.SHOW,
			achievement: KEY_HUNTER_ACHIEVEMENT,
		});

		vi.advanceTimersByTime(1);
		expect(actor.getSnapshot().value).toBe(
			ACHIEVEMENT_NOTIFICATION_MACHINE_STATES.SHOWING,
		);
		expect(actor.getSnapshot().context.activeAchievement).toEqual(
			KEY_HUNTER_ACHIEVEMENT,
		);

		vi.advanceTimersByTime(ACHIEVEMENT_DISPLAY_DURATION_MS);
		expect(actor.getSnapshot().value).toBe(
			ACHIEVEMENT_NOTIFICATION_MACHINE_STATES.IDLE,
		);
		expect(actor.getSnapshot().context.activeAchievement).toBeNull();
	});

	it("clears active achievement immediately on RESET event", () => {
		const actor = createActor(achievementNotificationMachine).start();

		actor.send({
			type: ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.SHOW,
			achievement: FIRST_STEPS_ACHIEVEMENT,
		});
		actor.send({
			type: ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.RESET,
		});

		expect(actor.getSnapshot().value).toBe(
			ACHIEVEMENT_NOTIFICATION_MACHINE_STATES.IDLE,
		);
		expect(actor.getSnapshot().context.activeAchievement).toBeNull();
	});
});
