import { assign, setup } from "xstate";

import {
	INPUT_ACTION_KEYS,
	INPUT_ACTOR_IDS,
	INPUT_EVENT_TYPES,
	INPUT_STATE_KEYS,
} from "../config";
import type { InputVector2 } from "./inputOrchestratorMachine";

type MovementInputContext = {
	readonly vector: InputVector2;
	readonly magnitude: number;
	readonly wantsRun: boolean;
};

type MovementInputEvent =
	| {
			readonly type: typeof INPUT_EVENT_TYPES.MOVE_CHANGED;
			readonly vector: InputVector2;
			readonly magnitude: number;
			readonly wantsRun: boolean;
	  }
	| { readonly type: typeof INPUT_EVENT_TYPES.MOVE_STOPPED };

const ZERO_VECTOR: InputVector2 = {
	x: 0,
	y: 0,
};

export const movementInputMachine = setup({
	types: {
		context: {} as MovementInputContext,
		events: {} as MovementInputEvent,
	},
	actions: {
		[INPUT_ACTION_KEYS.ASSIGN_MOVE_VECTOR]: assign({
			vector: ({ context, event }) =>
				event.type === INPUT_EVENT_TYPES.MOVE_CHANGED
					? event.vector
					: context.vector,
			magnitude: ({ context, event }) =>
				event.type === INPUT_EVENT_TYPES.MOVE_CHANGED
					? event.magnitude
					: context.magnitude,
			wantsRun: ({ context, event }) =>
				event.type === INPUT_EVENT_TYPES.MOVE_CHANGED
					? event.wantsRun
					: context.wantsRun,
		}),

		[INPUT_ACTION_KEYS.CLEAR_MOVE_VECTOR]: assign({
			vector: () => ZERO_VECTOR,
			magnitude: () => 0,
			wantsRun: () => false,
		}),
	},
}).createMachine({
	id: INPUT_ACTOR_IDS.MOVEMENT_INPUT,
	context: {
		vector: ZERO_VECTOR,
		magnitude: 0,
		wantsRun: false,
	},
	initial: INPUT_STATE_KEYS.MOVEMENT_IDLE,
	states: {
		[INPUT_STATE_KEYS.MOVEMENT_IDLE]: {
			on: {
				[INPUT_EVENT_TYPES.MOVE_CHANGED]: {
					target: INPUT_STATE_KEYS.MOVEMENT_ACTIVE,
					actions: [INPUT_ACTION_KEYS.ASSIGN_MOVE_VECTOR],
				},
			},
		},
		[INPUT_STATE_KEYS.MOVEMENT_ACTIVE]: {
			on: {
				[INPUT_EVENT_TYPES.MOVE_CHANGED]: {
					actions: [INPUT_ACTION_KEYS.ASSIGN_MOVE_VECTOR],
				},
				[INPUT_EVENT_TYPES.MOVE_STOPPED]: {
					target: INPUT_STATE_KEYS.MOVEMENT_IDLE,
					actions: [INPUT_ACTION_KEYS.CLEAR_MOVE_VECTOR],
				},
			},
		},
	},
});
