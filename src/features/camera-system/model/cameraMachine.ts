import { setup } from "xstate";

import {
	CAMERA_DEFAULT_MODE,
	CAMERA_MACHINE_ID,
	CAMERA_MODES,
} from "../config";

export const createCameraMachine = () =>
	setup({
		types: {
			context: {} as {
				playerPosition: [number, number, number];
				orbitTarget: [number, number, number];
			},
			events: {} as
				| { type: "SWITCH_TO_THIRD_PERSON" }
				| { type: "SWITCH_TO_TOP_DOWN" }
				| { type: "SWITCH_TO_FIRST_PERSON" }
				| { type: "SWITCH_TO_FREE_ORBITAL" }
				| { type: "HOTKEY"; hotkey: "1" | "2" | "3" | "4" },
		},
	}).createMachine({
		id: CAMERA_MACHINE_ID,
		initial: CAMERA_DEFAULT_MODE,
		context: {
			playerPosition: [0, 0, 0],
			orbitTarget: [0, 0, 0],
		},
		on: {
			SWITCH_TO_THIRD_PERSON: {
				target: `.${CAMERA_MODES.THIRD_PERSON}`,
			},
			SWITCH_TO_TOP_DOWN: {
				target: `.${CAMERA_MODES.TOP_DOWN}`,
			},
			SWITCH_TO_FIRST_PERSON: {
				target: `.${CAMERA_MODES.FIRST_PERSON}`,
			},
			SWITCH_TO_FREE_ORBITAL: {
				target: `.${CAMERA_MODES.FREE_ORBITAL}`,
			},
			HOTKEY: [
				{
					guard: ({ event }) => event.hotkey === "1",
					target: `.${CAMERA_MODES.THIRD_PERSON}`,
				},
				{
					guard: ({ event }) => event.hotkey === "2",
					target: `.${CAMERA_MODES.TOP_DOWN}`,
				},
				{
					guard: ({ event }) => event.hotkey === "3",
					target: `.${CAMERA_MODES.FIRST_PERSON}`,
				},
				{
					guard: ({ event }) => event.hotkey === "4",
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
