import { assign, setup } from "xstate";

import {
	ACHIEVEMENT_DISPLAY_DURATION_MS,
	ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS,
	ACHIEVEMENT_NOTIFICATION_MACHINE_ID,
	ACHIEVEMENT_NOTIFICATION_MACHINE_STATES,
} from "../config";
import {
	createIdleAchievementNotificationContext,
	createShowingAchievementNotificationContext,
} from "../lib";

import type {
	AchievementNotificationMachineContext,
	AchievementNotificationMachineEvent,
} from "./achievementNotificationMachineTypes";

export const achievementNotificationMachine = setup({
	types: {
		context: {} as AchievementNotificationMachineContext,
		events: {} as AchievementNotificationMachineEvent,
	},
}).createMachine({
	id: ACHIEVEMENT_NOTIFICATION_MACHINE_ID,
	initial: ACHIEVEMENT_NOTIFICATION_MACHINE_STATES.IDLE,
	context: createIdleAchievementNotificationContext(),
	states: {
		[ACHIEVEMENT_NOTIFICATION_MACHINE_STATES.IDLE]: {
			on: {
				[ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.SHOW]: {
					target: ACHIEVEMENT_NOTIFICATION_MACHINE_STATES.SHOWING,
					actions: assign(({ event }) =>
						createShowingAchievementNotificationContext(event.achievement),
					),
				},
				[ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.RESET]: {
					actions: assign(() => createIdleAchievementNotificationContext()),
				},
			},
		},
		[ACHIEVEMENT_NOTIFICATION_MACHINE_STATES.SHOWING]: {
			after: {
				[ACHIEVEMENT_DISPLAY_DURATION_MS]: {
					target: ACHIEVEMENT_NOTIFICATION_MACHINE_STATES.IDLE,
					actions: assign(() => createIdleAchievementNotificationContext()),
				},
			},
			on: {
				[ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.SHOW]: {
					target: ACHIEVEMENT_NOTIFICATION_MACHINE_STATES.SHOWING,
					reenter: true,
					actions: assign(({ event }) =>
						createShowingAchievementNotificationContext(event.achievement),
					),
				},
				[ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.RESET]: {
					target: ACHIEVEMENT_NOTIFICATION_MACHINE_STATES.IDLE,
					actions: assign(() => createIdleAchievementNotificationContext()),
				},
			},
		},
	},
});
