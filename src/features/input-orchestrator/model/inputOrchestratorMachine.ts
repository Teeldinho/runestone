import type { AnyActorRef } from "xstate";
import { assign, sendTo, setup } from "xstate";

import { PLAYER_EVENT_TYPES } from "@/entities/player";
import { CAMERA_EVENT_TYPES } from "@/shared/config";

import {
	INPUT_ACTION_KEYS,
	INPUT_EVENT_TYPES,
	INPUT_GUARD_KEYS,
	INPUT_MACHINE_IDS,
	INPUT_STATE_KEYS,
	type PointerRole,
} from "../config";
import {
	createPointerOwnershipSnapshot,
	hasActiveInputMovement,
	type PointerOwnershipSnapshot,
	resolveRunIntent,
} from "../lib";

export type InputVector2 = {
	readonly x: number;
	readonly y: number;
};

export const INTERACTION_INPUT_EVENT_TYPES = {
	INTERACT_PRESSED: "interaction.input.interact.pressed",
	ATTACK_PRESSED: "interaction.input.attack.pressed",
	FIRE_PRESSED: "interaction.input.fire.pressed",
} as const;

export type InputOrchestratorEvent =
	| {
			readonly type: typeof INPUT_EVENT_TYPES.POINTER_OWNER_ASSIGNED;
			readonly pointerId: number;
			readonly role: PointerRole;
	  }
	| {
			readonly type: typeof INPUT_EVENT_TYPES.POINTER_OWNER_RELEASED;
			readonly pointerId: number;
	  }
	| {
			readonly type: typeof INPUT_EVENT_TYPES.MOVE_CHANGED;
			readonly vector: InputVector2;
			readonly magnitude: number;
			readonly wantsRun: boolean;
	  }
	| { readonly type: typeof INPUT_EVENT_TYPES.MOVE_STOPPED }
	| {
			readonly type: typeof INPUT_EVENT_TYPES.LOOK_POINTER_STARTED;
			readonly pointerId: number;
	  }
	| {
			readonly type: typeof INPUT_EVENT_TYPES.LOOK_CHANGED;
			readonly delta: InputVector2;
	  }
	| { readonly type: typeof INPUT_EVENT_TYPES.LOOK_STOPPED }
	| {
			readonly type: typeof INPUT_EVENT_TYPES.ZOOM_CHANGED;
			readonly delta: number;
	  }
	| { readonly type: typeof INPUT_EVENT_TYPES.ZOOM_STOPPED }
	| {
			readonly type: typeof INPUT_EVENT_TYPES.RUN_HELD_CHANGED;
			readonly isHeld: boolean;
	  }
	| { readonly type: typeof INPUT_EVENT_TYPES.RUN_TOGGLED }
	| { readonly type: typeof INPUT_EVENT_TYPES.JUMP_PRESSED }
	| { readonly type: typeof INPUT_EVENT_TYPES.INTERACT_PRESSED }
	| { readonly type: typeof INPUT_EVENT_TYPES.ATTACK_PRESSED }
	| { readonly type: typeof INPUT_EVENT_TYPES.FIRE_PRESSED };

export type PlayerInputEvent =
	| {
			readonly type: typeof PLAYER_EVENT_TYPES.MOVE_CHANGED;
			readonly vector: InputVector2;
			readonly wantsRun: boolean;
	  }
	| { readonly type: typeof PLAYER_EVENT_TYPES.MOVE_STOPPED }
	| {
			readonly type: typeof PLAYER_EVENT_TYPES.RUN_HELD_CHANGED;
			readonly isHeld: boolean;
	  }
	| { readonly type: typeof PLAYER_EVENT_TYPES.JUMP_PRESSED };

export type CameraInputEvent =
	| {
			readonly type: typeof CAMERA_EVENT_TYPES.LOOK_CHANGED;
			readonly delta: InputVector2;
	  }
	| { readonly type: typeof CAMERA_EVENT_TYPES.LOOK_STOPPED }
	| {
			readonly type: typeof CAMERA_EVENT_TYPES.ZOOM_CHANGED;
			readonly delta: number;
	  };

export type InteractionInputEvent =
	| { readonly type: typeof INTERACTION_INPUT_EVENT_TYPES.INTERACT_PRESSED }
	| { readonly type: typeof INTERACTION_INPUT_EVENT_TYPES.ATTACK_PRESSED }
	| { readonly type: typeof INTERACTION_INPUT_EVENT_TYPES.FIRE_PRESSED };

export type InputOrchestratorContext = {
	readonly pointerOwnership: PointerOwnershipSnapshot;
	readonly moveVector: InputVector2;
	readonly moveMagnitude: number;
	readonly lookDelta: InputVector2;
	readonly zoomDelta: number;
	readonly isDesktopRunHeld: boolean;
	readonly isMobileRunToggled: boolean;
	readonly playerRef: AnyActorRef;
	readonly cameraRef: AnyActorRef;
	readonly interactionRef: AnyActorRef;
};

export type InputOrchestratorInput = Pick<
	InputOrchestratorContext,
	"playerRef" | "cameraRef" | "interactionRef"
>;

const ZERO_VECTOR: InputVector2 = {
	x: 0,
	y: 0,
};

export const inputOrchestratorMachine = setup({
	types: {
		context: {} as InputOrchestratorContext,
		events: {} as InputOrchestratorEvent,
		input: {} as InputOrchestratorInput,
	},
	guards: {
		[INPUT_GUARD_KEYS.HAS_ACTIVE_MOVEMENT]: ({ context }) =>
			hasActiveInputMovement({ vector: context.moveVector }),
	},
	actions: {
		[INPUT_ACTION_KEYS.ASSIGN_POINTER_OWNER]: assign({
			pointerOwnership: ({ context, event }) => {
				if (event.type !== INPUT_EVENT_TYPES.POINTER_OWNER_ASSIGNED) {
					return context.pointerOwnership;
				}

				return createPointerOwnershipSnapshot({
					currentOwnership: context.pointerOwnership,
					nextRecord: {
						pointerId: event.pointerId,
						role: event.role,
					},
				});
			},
		}),

		[INPUT_ACTION_KEYS.RELEASE_POINTER_OWNER]: assign({
			pointerOwnership: ({ context, event }) => {
				if (event.type !== INPUT_EVENT_TYPES.POINTER_OWNER_RELEASED) {
					return context.pointerOwnership;
				}

				return context.pointerOwnership.filter(
					(record) => record.pointerId !== event.pointerId,
				);
			},
		}),

		[INPUT_ACTION_KEYS.ASSIGN_MOVE_VECTOR]: assign({
			moveVector: ({ context, event }) =>
				event.type === INPUT_EVENT_TYPES.MOVE_CHANGED
					? event.vector
					: context.moveVector,

			moveMagnitude: ({ context, event }) =>
				event.type === INPUT_EVENT_TYPES.MOVE_CHANGED
					? event.magnitude
					: context.moveMagnitude,
		}),

		[INPUT_ACTION_KEYS.CLEAR_MOVE_VECTOR]: assign({
			moveVector: () => ZERO_VECTOR,
			moveMagnitude: () => 0,
		}),

		[INPUT_ACTION_KEYS.ASSIGN_LOOK_DELTA]: assign({
			lookDelta: ({ context, event }) =>
				event.type === INPUT_EVENT_TYPES.LOOK_CHANGED
					? event.delta
					: context.lookDelta,
		}),

		[INPUT_ACTION_KEYS.CLEAR_LOOK_DELTA]: assign({
			lookDelta: () => ZERO_VECTOR,
		}),

		[INPUT_ACTION_KEYS.ASSIGN_ZOOM_DELTA]: assign({
			zoomDelta: ({ context, event }) =>
				event.type === INPUT_EVENT_TYPES.ZOOM_CHANGED
					? event.delta
					: context.zoomDelta,
		}),

		[INPUT_ACTION_KEYS.CLEAR_ZOOM_DELTA]: assign({
			zoomDelta: () => 0,
		}),

		[INPUT_ACTION_KEYS.ASSIGN_RUN_HELD]: assign({
			isDesktopRunHeld: ({ context, event }) =>
				event.type === INPUT_EVENT_TYPES.RUN_HELD_CHANGED
					? event.isHeld
					: context.isDesktopRunHeld,
		}),

		[INPUT_ACTION_KEYS.SET_MOBILE_RUN_ENABLED]: assign({
			isMobileRunToggled: () => true,
		}),

		[INPUT_ACTION_KEYS.SET_MOBILE_RUN_DISABLED]: assign({
			isMobileRunToggled: () => false,
		}),

		[INPUT_ACTION_KEYS.SEND_PLAYER_MOVE]: sendTo(
			({ context }) => context.playerRef,
			({ event }) => {
				if (event.type !== INPUT_EVENT_TYPES.MOVE_CHANGED) {
					return { type: PLAYER_EVENT_TYPES.MOVE_STOPPED };
				}

				return {
					type: PLAYER_EVENT_TYPES.MOVE_CHANGED,
					vector: event.vector,
					wantsRun: event.wantsRun,
				};
			},
		),

		[INPUT_ACTION_KEYS.SEND_PLAYER_MOVE_WITH_RUN_ENABLED_FROM_CONTEXT]: sendTo(
			({ context }) => context.playerRef,
			({ context }) => ({
				type: PLAYER_EVENT_TYPES.MOVE_CHANGED,
				vector: context.moveVector,
				wantsRun: resolveRunIntent({
					isDesktopRunHeld: context.isDesktopRunHeld,
					isMobileRunToggled: true,
				}),
			}),
		),

		[INPUT_ACTION_KEYS.SEND_PLAYER_MOVE_WITH_RUN_DISABLED_FROM_CONTEXT]: sendTo(
			({ context }) => context.playerRef,
			({ context }) => ({
				type: PLAYER_EVENT_TYPES.MOVE_CHANGED,
				vector: context.moveVector,
				wantsRun: resolveRunIntent({
					isDesktopRunHeld: context.isDesktopRunHeld,
					isMobileRunToggled: false,
				}),
			}),
		),

		[INPUT_ACTION_KEYS.SEND_PLAYER_STOP]: sendTo(
			({ context }) => context.playerRef,
			() => ({ type: PLAYER_EVENT_TYPES.MOVE_STOPPED }),
		),

		[INPUT_ACTION_KEYS.SEND_PLAYER_RUN_HELD]: sendTo(
			({ context }) => context.playerRef,
			({ event }) => {
				if (event.type !== INPUT_EVENT_TYPES.RUN_HELD_CHANGED) {
					return {
						type: PLAYER_EVENT_TYPES.RUN_HELD_CHANGED,
						isHeld: false,
					};
				}

				return {
					type: PLAYER_EVENT_TYPES.RUN_HELD_CHANGED,
					isHeld: event.isHeld,
				};
			},
		),

		[INPUT_ACTION_KEYS.SEND_PLAYER_JUMP]: sendTo(
			({ context }) => context.playerRef,
			() => ({ type: PLAYER_EVENT_TYPES.JUMP_PRESSED }),
		),

		[INPUT_ACTION_KEYS.SEND_CAMERA_LOOK]: sendTo(
			({ context }) => context.cameraRef,
			({ event }) => {
				if (event.type !== INPUT_EVENT_TYPES.LOOK_CHANGED) {
					return { type: CAMERA_EVENT_TYPES.LOOK_STOPPED };
				}

				return {
					type: CAMERA_EVENT_TYPES.LOOK_CHANGED,
					delta: event.delta,
				};
			},
		),

		[INPUT_ACTION_KEYS.SEND_CAMERA_LOOK_STOP]: sendTo(
			({ context }) => context.cameraRef,
			() => ({ type: CAMERA_EVENT_TYPES.LOOK_STOPPED }),
		),

		[INPUT_ACTION_KEYS.SEND_CAMERA_ZOOM]: sendTo(
			({ context }) => context.cameraRef,
			({ event }) => {
				if (event.type !== INPUT_EVENT_TYPES.ZOOM_CHANGED) {
					return {
						type: CAMERA_EVENT_TYPES.ZOOM_CHANGED,
						delta: 0,
					};
				}

				return {
					type: CAMERA_EVENT_TYPES.ZOOM_CHANGED,
					delta: event.delta,
				};
			},
		),

		[INPUT_ACTION_KEYS.SEND_INTERACT]: sendTo(
			({ context }) => context.interactionRef,
			() => ({ type: INTERACTION_INPUT_EVENT_TYPES.INTERACT_PRESSED }),
		),

		[INPUT_ACTION_KEYS.SEND_ATTACK]: sendTo(
			({ context }) => context.interactionRef,
			() => ({ type: INTERACTION_INPUT_EVENT_TYPES.ATTACK_PRESSED }),
		),

		[INPUT_ACTION_KEYS.SEND_FIRE]: sendTo(
			({ context }) => context.interactionRef,
			() => ({ type: INTERACTION_INPUT_EVENT_TYPES.FIRE_PRESSED }),
		),
	},
}).createMachine({
	id: INPUT_MACHINE_IDS.INPUT_ORCHESTRATOR,
	context: ({ input }) => ({
		pointerOwnership: [],
		moveVector: ZERO_VECTOR,
		moveMagnitude: 0,
		lookDelta: ZERO_VECTOR,
		zoomDelta: 0,
		isDesktopRunHeld: false,
		isMobileRunToggled: false,
		playerRef: input.playerRef,
		cameraRef: input.cameraRef,
		interactionRef: input.interactionRef,
	}),
	initial: INPUT_STATE_KEYS.READY,
	states: {
		[INPUT_STATE_KEYS.READY]: {
			type: "parallel",
			states: {
				[INPUT_STATE_KEYS.MOVEMENT_REGION]: {
					initial: INPUT_STATE_KEYS.MOVEMENT_IDLE,
					states: {
						[INPUT_STATE_KEYS.MOVEMENT_IDLE]: {
							on: {
								[INPUT_EVENT_TYPES.MOVE_CHANGED]: {
									target: INPUT_STATE_KEYS.MOVEMENT_ACTIVE,
									actions: [
										INPUT_ACTION_KEYS.ASSIGN_MOVE_VECTOR,
										INPUT_ACTION_KEYS.SEND_PLAYER_MOVE,
									],
								},
							},
						},
						[INPUT_STATE_KEYS.MOVEMENT_ACTIVE]: {
							on: {
								[INPUT_EVENT_TYPES.MOVE_CHANGED]: {
									actions: [
										INPUT_ACTION_KEYS.ASSIGN_MOVE_VECTOR,
										INPUT_ACTION_KEYS.SEND_PLAYER_MOVE,
									],
								},
								[INPUT_EVENT_TYPES.MOVE_STOPPED]: {
									target: INPUT_STATE_KEYS.MOVEMENT_IDLE,
									actions: [
										INPUT_ACTION_KEYS.CLEAR_MOVE_VECTOR,
										INPUT_ACTION_KEYS.SEND_PLAYER_STOP,
									],
								},
							},
						},
					},
				},

				[INPUT_STATE_KEYS.LOOK_REGION]: {
					initial: INPUT_STATE_KEYS.LOOK_IDLE,
					states: {
						[INPUT_STATE_KEYS.LOOK_IDLE]: {
							on: {
								[INPUT_EVENT_TYPES.LOOK_CHANGED]: {
									target: INPUT_STATE_KEYS.LOOK_ACTIVE,
									actions: [
										INPUT_ACTION_KEYS.ASSIGN_LOOK_DELTA,
										INPUT_ACTION_KEYS.SEND_CAMERA_LOOK,
									],
								},
							},
						},
						[INPUT_STATE_KEYS.LOOK_ACTIVE]: {
							on: {
								[INPUT_EVENT_TYPES.LOOK_CHANGED]: {
									actions: [
										INPUT_ACTION_KEYS.ASSIGN_LOOK_DELTA,
										INPUT_ACTION_KEYS.SEND_CAMERA_LOOK,
									],
								},
								[INPUT_EVENT_TYPES.LOOK_STOPPED]: {
									target: INPUT_STATE_KEYS.LOOK_IDLE,
									actions: [
										INPUT_ACTION_KEYS.CLEAR_LOOK_DELTA,
										INPUT_ACTION_KEYS.SEND_CAMERA_LOOK_STOP,
									],
								},
							},
						},
					},
				},

				[INPUT_STATE_KEYS.ZOOM_REGION]: {
					initial: INPUT_STATE_KEYS.ZOOM_IDLE,
					states: {
						[INPUT_STATE_KEYS.ZOOM_IDLE]: {
							on: {
								[INPUT_EVENT_TYPES.ZOOM_CHANGED]: {
									target: INPUT_STATE_KEYS.ZOOM_ACTIVE,
									actions: [
										INPUT_ACTION_KEYS.ASSIGN_ZOOM_DELTA,
										INPUT_ACTION_KEYS.SEND_CAMERA_ZOOM,
									],
								},
							},
						},
						[INPUT_STATE_KEYS.ZOOM_ACTIVE]: {
							on: {
								[INPUT_EVENT_TYPES.ZOOM_CHANGED]: {
									actions: [
										INPUT_ACTION_KEYS.ASSIGN_ZOOM_DELTA,
										INPUT_ACTION_KEYS.SEND_CAMERA_ZOOM,
									],
								},
								[INPUT_EVENT_TYPES.ZOOM_STOPPED]: {
									target: INPUT_STATE_KEYS.ZOOM_IDLE,
									actions: [INPUT_ACTION_KEYS.CLEAR_ZOOM_DELTA],
								},
							},
						},
					},
				},

				[INPUT_STATE_KEYS.ACTION_REGION]: {
					initial: INPUT_STATE_KEYS.ACTION_READY,
					states: {
						[INPUT_STATE_KEYS.ACTION_READY]: {
							on: {
								[INPUT_EVENT_TYPES.RUN_HELD_CHANGED]: {
									actions: [
										INPUT_ACTION_KEYS.ASSIGN_RUN_HELD,
										INPUT_ACTION_KEYS.SEND_PLAYER_RUN_HELD,
									],
								},
								[INPUT_EVENT_TYPES.JUMP_PRESSED]: {
									actions: [INPUT_ACTION_KEYS.SEND_PLAYER_JUMP],
								},
								[INPUT_EVENT_TYPES.INTERACT_PRESSED]: {
									actions: [INPUT_ACTION_KEYS.SEND_INTERACT],
								},
								[INPUT_EVENT_TYPES.ATTACK_PRESSED]: {
									actions: [INPUT_ACTION_KEYS.SEND_ATTACK],
								},
								[INPUT_EVENT_TYPES.FIRE_PRESSED]: {
									actions: [INPUT_ACTION_KEYS.SEND_FIRE],
								},
							},
						},
					},
				},

				[INPUT_STATE_KEYS.RUN_TOGGLE_REGION]: {
					initial: INPUT_STATE_KEYS.RUN_TOGGLE_OFF,
					states: {
						[INPUT_STATE_KEYS.RUN_TOGGLE_OFF]: {
							on: {
								[INPUT_EVENT_TYPES.RUN_TOGGLED]: [
									{
										guard: INPUT_GUARD_KEYS.HAS_ACTIVE_MOVEMENT,
										target: INPUT_STATE_KEYS.RUN_TOGGLE_ON,
										actions: [
											INPUT_ACTION_KEYS.SET_MOBILE_RUN_ENABLED,
											INPUT_ACTION_KEYS.SEND_PLAYER_MOVE_WITH_RUN_ENABLED_FROM_CONTEXT,
										],
									},
									{
										target: INPUT_STATE_KEYS.RUN_TOGGLE_ON,
										actions: [INPUT_ACTION_KEYS.SET_MOBILE_RUN_ENABLED],
									},
								],
							},
						},
						[INPUT_STATE_KEYS.RUN_TOGGLE_ON]: {
							on: {
								[INPUT_EVENT_TYPES.RUN_TOGGLED]: [
									{
										guard: INPUT_GUARD_KEYS.HAS_ACTIVE_MOVEMENT,
										target: INPUT_STATE_KEYS.RUN_TOGGLE_OFF,
										actions: [
											INPUT_ACTION_KEYS.SET_MOBILE_RUN_DISABLED,
											INPUT_ACTION_KEYS.SEND_PLAYER_MOVE_WITH_RUN_DISABLED_FROM_CONTEXT,
										],
									},
									{
										target: INPUT_STATE_KEYS.RUN_TOGGLE_OFF,
										actions: [INPUT_ACTION_KEYS.SET_MOBILE_RUN_DISABLED],
									},
								],
							},
						},
					},
				},
			},

			on: {
				[INPUT_EVENT_TYPES.POINTER_OWNER_ASSIGNED]: {
					actions: [INPUT_ACTION_KEYS.ASSIGN_POINTER_OWNER],
				},
				[INPUT_EVENT_TYPES.POINTER_OWNER_RELEASED]: {
					actions: [INPUT_ACTION_KEYS.RELEASE_POINTER_OWNER],
				},
			},
		},
	},
});
