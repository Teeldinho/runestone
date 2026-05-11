import { assign, setup } from "xstate";

import { CAMERA_MODES } from "@/shared/config";

import {
	CAMERA_ACTION_KEYS,
	CAMERA_DEFAULT_MODE,
	CAMERA_EVENT_TYPES,
	CAMERA_LIMITS,
	CAMERA_MACHINE_ID,
} from "../config";
import { clampCameraDistance } from "../lib";

export const createCameraMachine = () =>
	setup({
		types: {
			context: {} as {
				playerPosition: [number, number, number];
				orbitTarget: [number, number, number];
				lookDelta: { readonly x: number; readonly y: number };
				zoomDelta: number;
				distance: number;
			},
			events: {} as
				| { type: "SWITCH_TO_THIRD_PERSON" }
				| { type: "SWITCH_TO_TOP_DOWN" }
				| { type: "SWITCH_TO_FIRST_PERSON" }
				| { type: "SWITCH_TO_FREE_ORBITAL" }
				| { type: "HOTKEY"; hotkey: "1" | "2" | "3" | "4" }
				| {
						readonly type: typeof CAMERA_EVENT_TYPES.LOOK_CHANGED;
						readonly delta: { readonly x: number; readonly y: number };
				  }
				| { readonly type: typeof CAMERA_EVENT_TYPES.LOOK_STOPPED }
				| {
						readonly type: typeof CAMERA_EVENT_TYPES.ZOOM_CHANGED;
						readonly delta: number;
				  },
		},
		actions: {
			[CAMERA_ACTION_KEYS.ASSIGN_LOOK_DELTA]: assign({
				lookDelta: ({ context, event }) =>
					event.type === CAMERA_EVENT_TYPES.LOOK_CHANGED
						? event.delta
						: context.lookDelta,
			}),

			[CAMERA_ACTION_KEYS.CLEAR_LOOK_DELTA]: assign({
				lookDelta: () => ({ x: 0, y: 0 }),
			}),

			[CAMERA_ACTION_KEYS.ASSIGN_ZOOM_DELTA]: assign({
				zoomDelta: ({ context, event }) =>
					event.type === CAMERA_EVENT_TYPES.ZOOM_CHANGED
						? event.delta
						: context.zoomDelta,
				distance: ({ context, event }) =>
					event.type === CAMERA_EVENT_TYPES.ZOOM_CHANGED
						? clampCameraDistance(
								context.distance + event.delta * CAMERA_LIMITS.ZOOM_STEP,
							)
						: context.distance,
			}),
		},
	}).createMachine({
		id: CAMERA_MACHINE_ID,
		initial: CAMERA_DEFAULT_MODE,
		context: {
			playerPosition: [0, 0, 0],
			orbitTarget: [0, 0, 0],
			lookDelta: { x: 0, y: 0 },
			zoomDelta: 0,
			distance: CAMERA_LIMITS.DEFAULT_DISTANCE,
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
			[CAMERA_EVENT_TYPES.LOOK_CHANGED]: {
				actions: [CAMERA_ACTION_KEYS.ASSIGN_LOOK_DELTA],
			},
			[CAMERA_EVENT_TYPES.LOOK_STOPPED]: {
				actions: [CAMERA_ACTION_KEYS.CLEAR_LOOK_DELTA],
			},
			[CAMERA_EVENT_TYPES.ZOOM_CHANGED]: {
				actions: [CAMERA_ACTION_KEYS.ASSIGN_ZOOM_DELTA],
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
