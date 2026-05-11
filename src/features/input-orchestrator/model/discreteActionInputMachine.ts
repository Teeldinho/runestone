import { setup } from "xstate";

import {
	INPUT_EVENT_TYPES,
	INPUT_MACHINE_IDS,
	INPUT_STATE_KEYS,
} from "../config";

type DiscreteActionInputEvent =
	| { readonly type: typeof INPUT_EVENT_TYPES.RUN_TOGGLED }
	| { readonly type: typeof INPUT_EVENT_TYPES.JUMP_PRESSED }
	| { readonly type: typeof INPUT_EVENT_TYPES.INTERACT_PRESSED }
	| { readonly type: typeof INPUT_EVENT_TYPES.ATTACK_PRESSED }
	| { readonly type: typeof INPUT_EVENT_TYPES.FIRE_PRESSED };

export const discreteActionInputMachine = setup({
	types: {
		events: {} as DiscreteActionInputEvent,
	},
}).createMachine({
	id: INPUT_MACHINE_IDS.DISCRETE_ACTION_INPUT,
	initial: INPUT_STATE_KEYS.ACTION_READY,
	states: {
		[INPUT_STATE_KEYS.ACTION_READY]: {
			on: {
				[INPUT_EVENT_TYPES.RUN_TOGGLED]: {},
				[INPUT_EVENT_TYPES.JUMP_PRESSED]: {},
				[INPUT_EVENT_TYPES.INTERACT_PRESSED]: {},
				[INPUT_EVENT_TYPES.ATTACK_PRESSED]: {},
				[INPUT_EVENT_TYPES.FIRE_PRESSED]: {},
			},
		},
	},
});
