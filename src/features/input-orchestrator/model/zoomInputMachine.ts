import { assign, setup } from "xstate";

import {
	INPUT_ACTION_KEYS,
	INPUT_EVENT_TYPES,
	INPUT_MACHINE_IDS,
	INPUT_STATE_KEYS,
} from "../config";

type ZoomInputContext = {
	readonly delta: number;
};

type ZoomInputEvent =
	| {
			readonly type: typeof INPUT_EVENT_TYPES.ZOOM_CHANGED;
			readonly delta: number;
	  }
	| { readonly type: typeof INPUT_EVENT_TYPES.ZOOM_STOPPED };

export const zoomInputMachine = setup({
	types: {
		context: {} as ZoomInputContext,
		events: {} as ZoomInputEvent,
	},
	actions: {
		[INPUT_ACTION_KEYS.ASSIGN_ZOOM_DELTA]: assign({
			delta: ({ context, event }) =>
				event.type === INPUT_EVENT_TYPES.ZOOM_CHANGED
					? event.delta
					: context.delta,
		}),

		[INPUT_ACTION_KEYS.CLEAR_ZOOM_DELTA]: assign({
			delta: () => 0,
		}),
	},
}).createMachine({
	id: INPUT_MACHINE_IDS.ZOOM_INPUT,
	context: {
		delta: 0,
	},
	initial: INPUT_STATE_KEYS.ZOOM_IDLE,
	states: {
		[INPUT_STATE_KEYS.ZOOM_IDLE]: {
			on: {
				[INPUT_EVENT_TYPES.ZOOM_CHANGED]: {
					target: INPUT_STATE_KEYS.ZOOM_ACTIVE,
					actions: [INPUT_ACTION_KEYS.ASSIGN_ZOOM_DELTA],
				},
			},
		},
		[INPUT_STATE_KEYS.ZOOM_ACTIVE]: {
			on: {
				[INPUT_EVENT_TYPES.ZOOM_CHANGED]: {
					actions: [INPUT_ACTION_KEYS.ASSIGN_ZOOM_DELTA],
				},
				[INPUT_EVENT_TYPES.ZOOM_STOPPED]: {
					target: INPUT_STATE_KEYS.ZOOM_IDLE,
					actions: [INPUT_ACTION_KEYS.CLEAR_ZOOM_DELTA],
				},
			},
		},
	},
});
