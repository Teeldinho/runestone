import { assign, setup } from "xstate";

import { CAMERA_MODES } from "@/shared/config";

import {
	CAMERA_ACTION_KEYS,
	CAMERA_DEFAULT_MODE,
	CAMERA_EVENT_TYPES,
	CAMERA_HOTKEYS,
	CAMERA_LIMITS,
	CAMERA_LOOK_LIMITS,
	CAMERA_MACHINE_ID,
} from "../config";
import {
	clampCameraDistance,
	resolveCameraModeDistance,
	resolveNextCameraLookAngles,
} from "../lib";

const CAMERA_HOTKEY_VALUES = [
	CAMERA_HOTKEYS.THIRD_PERSON,
	CAMERA_HOTKEYS.TOP_DOWN,
	CAMERA_HOTKEYS.FIRST_PERSON,
	CAMERA_HOTKEYS.FREE_ORBITAL,
] as const;

export const createCameraMachine = () =>
	setup({
		types: {
			context: {} as {
				playerPosition: [number, number, number];
				orbitTarget: [number, number, number];
				lookDelta: { readonly x: number; readonly y: number };
				zoomDelta: number;
				distance: number;
				yaw: number;
				pitch: number;
			},
			events: {} as
				| { type: typeof CAMERA_EVENT_TYPES.SWITCH_TO_THIRD_PERSON }
				| { type: typeof CAMERA_EVENT_TYPES.SWITCH_TO_TOP_DOWN }
				| { type: typeof CAMERA_EVENT_TYPES.SWITCH_TO_FIRST_PERSON }
				| { type: typeof CAMERA_EVENT_TYPES.SWITCH_TO_FREE_ORBITAL }
				| {
						type: typeof CAMERA_EVENT_TYPES.HOTKEY;
						hotkey: (typeof CAMERA_HOTKEY_VALUES)[number];
				  }
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

				yaw: ({ context, event }) =>
					event.type === CAMERA_EVENT_TYPES.LOOK_CHANGED
						? resolveNextCameraLookAngles({
								currentYaw: context.yaw,
								currentPitch: context.pitch,
								delta: event.delta,
							}).yaw
						: context.yaw,

				pitch: ({ context, event }) =>
					event.type === CAMERA_EVENT_TYPES.LOOK_CHANGED
						? resolveNextCameraLookAngles({
								currentYaw: context.yaw,
								currentPitch: context.pitch,
								delta: event.delta,
							}).pitch
						: context.pitch,
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
			distance: resolveCameraModeDistance(CAMERA_DEFAULT_MODE),
			yaw: CAMERA_LOOK_LIMITS.DEFAULT_YAW,
			pitch: CAMERA_LOOK_LIMITS.DEFAULT_PITCH,
		},
		on: {
			[CAMERA_EVENT_TYPES.SWITCH_TO_THIRD_PERSON]: {
				actions: assign({
					distance: () => resolveCameraModeDistance(CAMERA_MODES.THIRD_PERSON),
				}),
				target: `.${CAMERA_MODES.THIRD_PERSON}`,
			},
			[CAMERA_EVENT_TYPES.SWITCH_TO_TOP_DOWN]: {
				actions: assign({
					distance: () => resolveCameraModeDistance(CAMERA_MODES.TOP_DOWN),
				}),
				target: `.${CAMERA_MODES.TOP_DOWN}`,
			},
			[CAMERA_EVENT_TYPES.SWITCH_TO_FIRST_PERSON]: {
				actions: assign({
					distance: () => resolveCameraModeDistance(CAMERA_MODES.FIRST_PERSON),
				}),
				target: `.${CAMERA_MODES.FIRST_PERSON}`,
			},
			[CAMERA_EVENT_TYPES.SWITCH_TO_FREE_ORBITAL]: {
				actions: assign({
					distance: () => resolveCameraModeDistance(CAMERA_MODES.FREE_ORBITAL),
				}),
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
			[CAMERA_EVENT_TYPES.HOTKEY]: [
				{
					guard: ({ event }) => event.hotkey === CAMERA_HOTKEYS.THIRD_PERSON,
					actions: assign({
						distance: () =>
							resolveCameraModeDistance(CAMERA_MODES.THIRD_PERSON),
					}),
					target: `.${CAMERA_MODES.THIRD_PERSON}`,
				},
				{
					guard: ({ event }) => event.hotkey === CAMERA_HOTKEYS.TOP_DOWN,
					actions: assign({
						distance: () => resolveCameraModeDistance(CAMERA_MODES.TOP_DOWN),
					}),
					target: `.${CAMERA_MODES.TOP_DOWN}`,
				},
				{
					guard: ({ event }) => event.hotkey === CAMERA_HOTKEYS.FIRST_PERSON,
					actions: assign({
						distance: () =>
							resolveCameraModeDistance(CAMERA_MODES.FIRST_PERSON),
					}),
					target: `.${CAMERA_MODES.FIRST_PERSON}`,
				},
				{
					guard: ({ event }) => event.hotkey === CAMERA_HOTKEYS.FREE_ORBITAL,
					actions: assign({
						distance: () =>
							resolveCameraModeDistance(CAMERA_MODES.FREE_ORBITAL),
					}),
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
