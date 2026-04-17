import { assign, setup } from "xstate";

import {
	INTERACTION_COOLDOWN_MACHINE_DELAYS,
	INTERACTION_COOLDOWN_MACHINE_EVENTS,
	INTERACTION_COOLDOWN_MACHINE_ID,
	INTERACTION_COOLDOWN_MACHINE_STATES,
} from "../config";
import {
	createAttackInteractionCooldownContext,
	createInteractInteractionCooldownContext,
	createReadyInteractionCooldownContext,
} from "../lib";

import type {
	InteractionCooldownMachineContext,
	InteractionCooldownMachineEvent,
} from "./interactionCooldownMachineTypes";

export const interactionCooldownMachine = setup({
	types: {
		context: {} as InteractionCooldownMachineContext,
		events: {} as InteractionCooldownMachineEvent,
	},
	delays: {
		[INTERACTION_COOLDOWN_MACHINE_DELAYS.RELEASE]: ({ context }) =>
			context.cooldownMs,
	},
}).createMachine({
	id: INTERACTION_COOLDOWN_MACHINE_ID,
	initial: INTERACTION_COOLDOWN_MACHINE_STATES.READY,
	context: createReadyInteractionCooldownContext(),
	states: {
		[INTERACTION_COOLDOWN_MACHINE_STATES.READY]: {
			on: {
				[INTERACTION_COOLDOWN_MACHINE_EVENTS.START_INTERACT]: {
					target: INTERACTION_COOLDOWN_MACHINE_STATES.COOLDOWN,
					actions: assign(() => createInteractInteractionCooldownContext()),
				},
				[INTERACTION_COOLDOWN_MACHINE_EVENTS.START_ATTACK]: {
					target: INTERACTION_COOLDOWN_MACHINE_STATES.COOLDOWN,
					actions: assign(() => createAttackInteractionCooldownContext()),
				},
				[INTERACTION_COOLDOWN_MACHINE_EVENTS.RESET]: {
					actions: assign(() => createReadyInteractionCooldownContext()),
				},
			},
		},
		[INTERACTION_COOLDOWN_MACHINE_STATES.COOLDOWN]: {
			after: {
				[INTERACTION_COOLDOWN_MACHINE_DELAYS.RELEASE]: {
					target: INTERACTION_COOLDOWN_MACHINE_STATES.READY,
					actions: assign(() => createReadyInteractionCooldownContext()),
				},
			},
			on: {
				[INTERACTION_COOLDOWN_MACHINE_EVENTS.RESET]: {
					target: INTERACTION_COOLDOWN_MACHINE_STATES.READY,
					actions: assign(() => createReadyInteractionCooldownContext()),
				},
			},
		},
	},
});
