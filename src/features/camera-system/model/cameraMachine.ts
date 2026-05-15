import { setup } from "xstate";

import {
	CAMERA_DEFAULT_MODE,
	CAMERA_EVENTS,
	CAMERA_HOTKEYS,
	CAMERA_MACHINE_ID,
	CAMERA_MODES,
} from "../config";

const CAMERA_HOTKEY_VALUES = [
	CAMERA_HOTKEYS.THIRD_PERSON,
	CAMERA_HOTKEYS.TOP_DOWN,
	CAMERA_HOTKEYS.FIRST_PERSON,
	CAMERA_HOTKEYS.FREE_ORBITAL,
] as const;

export const createCameraMachine = () =>
	setup({
		types: {
			context: {} as Record<string, never>,
			events: {} as
				| { type: typeof CAMERA_EVENTS.SWITCH_TO_THIRD_PERSON }
				| { type: typeof CAMERA_EVENTS.SWITCH_TO_TOP_DOWN }
				| { type: typeof CAMERA_EVENTS.SWITCH_TO_FIRST_PERSON }
				| { type: typeof CAMERA_EVENTS.SWITCH_TO_FREE_ORBITAL }
				| {
						type: typeof CAMERA_EVENTS.HOTKEY;
						hotkey: (typeof CAMERA_HOTKEY_VALUES)[number];
				  },
		},
	}).createMachine({
		id: CAMERA_MACHINE_ID,
		initial: CAMERA_DEFAULT_MODE,
		context: {},
		on: {
			[CAMERA_EVENTS.SWITCH_TO_THIRD_PERSON]: {
				target: `.${CAMERA_MODES.THIRD_PERSON}`,
			},
			[CAMERA_EVENTS.SWITCH_TO_TOP_DOWN]: {
				target: `.${CAMERA_MODES.TOP_DOWN}`,
			},
			[CAMERA_EVENTS.SWITCH_TO_FIRST_PERSON]: {
				target: `.${CAMERA_MODES.FIRST_PERSON}`,
			},
			[CAMERA_EVENTS.SWITCH_TO_FREE_ORBITAL]: {
				target: `.${CAMERA_MODES.FREE_ORBITAL}`,
			},
			[CAMERA_EVENTS.HOTKEY]: [
				{
					guard: ({ event }) => event.hotkey === CAMERA_HOTKEYS.THIRD_PERSON,
					target: `.${CAMERA_MODES.THIRD_PERSON}`,
				},
				{
					guard: ({ event }) => event.hotkey === CAMERA_HOTKEYS.TOP_DOWN,
					target: `.${CAMERA_MODES.TOP_DOWN}`,
				},
				{
					guard: ({ event }) => event.hotkey === CAMERA_HOTKEYS.FIRST_PERSON,
					target: `.${CAMERA_MODES.FIRST_PERSON}`,
				},
				{
					guard: ({ event }) => event.hotkey === CAMERA_HOTKEYS.FREE_ORBITAL,
					target: `.${CAMERA_MODES.FREE_ORBITAL}`,
				},
			],
		},
		states: {
			[CAMERA_MODES.THIRD_PERSON]: {},
			[CAMERA_MODES.TOP_DOWN]: {},
			[CAMERA_MODES.FIRST_PERSON]: {},
			[CAMERA_MODES.FREE_ORBITAL]: {},
		},
	});
