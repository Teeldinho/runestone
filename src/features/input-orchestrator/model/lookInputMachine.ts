import { assign, setup } from "xstate";

import {
	INPUT_ACTION_KEYS,
	INPUT_EVENT_TYPES,
	INPUT_MACHINE_IDS,
	INPUT_STATE_KEYS,
} from "../config";
import type { InputVector2 } from "./inputOrchestratorMachine";

type LookInputContext = {
	readonly pointerId: number | null;
	readonly delta: InputVector2;
};

type LookInputEvent =
	| {
			readonly type: typeof INPUT_EVENT_TYPES.LOOK_POINTER_STARTED;
			readonly pointerId: number;
	  }
	| {
			readonly type: typeof INPUT_EVENT_TYPES.LOOK_CHANGED;
			readonly delta: InputVector2;
	  }
	| { readonly type: typeof INPUT_EVENT_TYPES.LOOK_STOPPED };

const ZERO_VECTOR: InputVector2 = {
	x: 0,
	y: 0,
};

export const lookInputMachine = setup({
	types: {
		context: {} as LookInputContext,
		events: {} as LookInputEvent,
	},
	actions: {
		[INPUT_ACTION_KEYS.ASSIGN_LOOK_POINTER]: assign({
			pointerId: ({ context, event }) =>
				event.type === INPUT_EVENT_TYPES.LOOK_POINTER_STARTED
					? event.pointerId
					: context.pointerId,
		}),

		[INPUT_ACTION_KEYS.CLEAR_LOOK_POINTER]: assign({
			pointerId: () => null,
		}),

		[INPUT_ACTION_KEYS.ASSIGN_LOOK_DELTA]: assign({
			delta: ({ context, event }) =>
				event.type === INPUT_EVENT_TYPES.LOOK_CHANGED
					? event.delta
					: context.delta,
		}),

		[INPUT_ACTION_KEYS.CLEAR_LOOK_DELTA]: assign({
			delta: () => ZERO_VECTOR,
		}),
	},
}).createMachine({
	id: INPUT_MACHINE_IDS.LOOK_INPUT,
	context: {
		pointerId: null,
		delta: ZERO_VECTOR,
	},
	initial: INPUT_STATE_KEYS.LOOK_IDLE,
	states: {
		[INPUT_STATE_KEYS.LOOK_IDLE]: {
			on: {
				[INPUT_EVENT_TYPES.LOOK_POINTER_STARTED]: {
					target: INPUT_STATE_KEYS.LOOK_ACTIVE,
					actions: [INPUT_ACTION_KEYS.ASSIGN_LOOK_POINTER],
				},
				[INPUT_EVENT_TYPES.LOOK_CHANGED]: {
					target: INPUT_STATE_KEYS.LOOK_ACTIVE,
					actions: [INPUT_ACTION_KEYS.ASSIGN_LOOK_DELTA],
				},
			},
		},
		[INPUT_STATE_KEYS.LOOK_ACTIVE]: {
			on: {
				[INPUT_EVENT_TYPES.LOOK_CHANGED]: {
					actions: [INPUT_ACTION_KEYS.ASSIGN_LOOK_DELTA],
				},
				[INPUT_EVENT_TYPES.LOOK_STOPPED]: {
					target: INPUT_STATE_KEYS.LOOK_IDLE,
					actions: [
						INPUT_ACTION_KEYS.CLEAR_LOOK_POINTER,
						INPUT_ACTION_KEYS.CLEAR_LOOK_DELTA,
					],
				},
			},
		},
	},
});
