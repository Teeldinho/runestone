import { assign, setup } from "xstate";

import { MACHINE_STATE_TYPES } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";

import {
	PLAYER_ACTION_KEYS,
	PLAYER_CONTEXT_KEYS,
	PLAYER_EVENT_TYPES,
	PLAYER_EVENTS,
	PLAYER_GUARD_KEYS,
	PLAYER_GUARDS,
	PLAYER_MACHINE_DEFAULTS,
	PLAYER_MACHINE_ID,
	PLAYER_STATES,
} from "../config";
import {
	applyDamage,
	applyDeath,
	applyHeal,
	checkLethalDamage,
	checkPlayerAlive,
} from "../lib";
import type {
	PlayerHealEvent,
	PlayerMachineContext,
	PlayerMachineEvent,
	PlayerMoveChangedEvent,
	PlayerMoveEvent,
	PlayerRunHeldChangedEvent,
	PlayerTakeDamageEvent,
} from "./types";

const ZERO_VECTOR = { x: 0, y: 0 };

export const createPlayerMachine = () =>
	setup({
		types: {
			context: {} as PlayerMachineContext,
			events: {} as PlayerMachineEvent,
		},
		guards: {
			[PLAYER_GUARDS.IS_LETHAL_DAMAGE]: ({ context, event }) =>
				checkLethalDamage(
					context.stats.hp,
					(event as PlayerTakeDamageEvent).amount,
				),
			[PLAYER_GUARDS.IS_PLAYER_ALIVE]: ({ context }) =>
				checkPlayerAlive(context.stats.hp),
			[PLAYER_GUARD_KEYS.WANTS_RUN]: ({ event }) =>
				(event as PlayerMoveChangedEvent).wantsRun,
		},
		actions: {
			[PLAYER_ACTION_KEYS.ASSIGN_MOVE_VECTOR]: assign({
				moveVector: ({ context, event }) =>
					event.type === PLAYER_EVENT_TYPES.MOVE_CHANGED
						? (event as PlayerMoveChangedEvent).vector
						: context.moveVector,
				isRunHeld: ({ context, event }) =>
					event.type === PLAYER_EVENT_TYPES.MOVE_CHANGED
						? (event as PlayerMoveChangedEvent).wantsRun
						: context.isRunHeld,
			}),

			[PLAYER_ACTION_KEYS.CLEAR_MOVE_VECTOR]: assign({
				moveVector: () => ZERO_VECTOR,
			}),

			[PLAYER_ACTION_KEYS.ASSIGN_RUN_HELD]: assign({
				isRunHeld: ({ context, event }) =>
					event.type === PLAYER_EVENT_TYPES.RUN_HELD_CHANGED
						? (event as PlayerRunHeldChangedEvent).isHeld
						: context.isRunHeld,
			}),

			[PLAYER_ACTION_KEYS.REQUEST_JUMP_IMPULSE]: assign({
				wantsJumpImpulse: () => true,
			}),

			[PLAYER_ACTION_KEYS.CLEAR_JUMP_REQUEST]: assign({
				wantsJumpImpulse: () => false,
			}),
		},
	}).createMachine({
		id: PLAYER_MACHINE_ID,
		type: MACHINE_STATE_TYPES.PARALLEL,
		context: {
			[PLAYER_CONTEXT_KEYS.IS_SPRINTING]: PLAYER_MACHINE_DEFAULTS.IS_SPRINTING,
			[PLAYER_CONTEXT_KEYS.POSITION]: [
				...PLAYER_MACHINE_DEFAULTS.POSITION,
			] as unknown as Vector3Tuple,
			[PLAYER_CONTEXT_KEYS.VELOCITY]: [
				...PLAYER_MACHINE_DEFAULTS.VELOCITY,
			] as unknown as Vector3Tuple,
			[PLAYER_CONTEXT_KEYS.STATS]: {
				maxHp: PLAYER_MACHINE_DEFAULTS.STATS.MAX_HP,
				hp: PLAYER_MACHINE_DEFAULTS.STATS.HP,
				score: PLAYER_MACHINE_DEFAULTS.STATS.SCORE,
				keyCount: PLAYER_MACHINE_DEFAULTS.STATS.KEY_COUNT,
				chainMultiplier: PLAYER_MACHINE_DEFAULTS.STATS.CHAIN_MULTIPLIER,
			},
			[PLAYER_CONTEXT_KEYS.MOVE_VECTOR]: PLAYER_MACHINE_DEFAULTS.MOVE_VECTOR,
			[PLAYER_CONTEXT_KEYS.IS_RUN_HELD]: PLAYER_MACHINE_DEFAULTS.IS_RUN_HELD,
			[PLAYER_CONTEXT_KEYS.WANTS_JUMP_IMPULSE]:
				PLAYER_MACHINE_DEFAULTS.WANTS_JUMP_IMPULSE,
		},
		states: {
			[PLAYER_STATES.REGIONS.MOVEMENT]: {
				initial: PLAYER_STATES.MOVEMENT.IDLE,
				states: {
					[PLAYER_STATES.MOVEMENT.IDLE]: {
						on: {
							[PLAYER_EVENTS.MOVE]: {
								guard: PLAYER_GUARDS.IS_PLAYER_ALIVE,
								target: PLAYER_STATES.MOVEMENT.WALKING,
								actions: assign(({ event }) => ({
									[PLAYER_CONTEXT_KEYS.VELOCITY]: (event as PlayerMoveEvent)
										.velocity,
									[PLAYER_CONTEXT_KEYS.IS_SPRINTING]: (event as PlayerMoveEvent)
										.isSprinting,
								})),
							},
							[PLAYER_EVENT_TYPES.MOVE_CHANGED]: [
								{
									guard: PLAYER_GUARD_KEYS.WANTS_RUN,
									target: PLAYER_STATES.MOVEMENT.RUNNING,
									actions: [PLAYER_ACTION_KEYS.ASSIGN_MOVE_VECTOR],
								},
								{
									target: PLAYER_STATES.MOVEMENT.WALKING,
									actions: [PLAYER_ACTION_KEYS.ASSIGN_MOVE_VECTOR],
								},
							],
						},
					},
					[PLAYER_STATES.MOVEMENT.WALKING]: {
						on: {
							[PLAYER_EVENTS.MOVE]: {
								guard: PLAYER_GUARDS.IS_PLAYER_ALIVE,
								actions: assign(({ event }) => ({
									[PLAYER_CONTEXT_KEYS.VELOCITY]: (event as PlayerMoveEvent)
										.velocity,
									[PLAYER_CONTEXT_KEYS.IS_SPRINTING]: (event as PlayerMoveEvent)
										.isSprinting,
								})),
							},
							[PLAYER_EVENTS.STOP]: {
								target: PLAYER_STATES.MOVEMENT.IDLE,
								actions: assign(() => ({
									[PLAYER_CONTEXT_KEYS.VELOCITY]: [
										0, 0, 0,
									] as unknown as Vector3Tuple,
								})),
							},
							[PLAYER_EVENT_TYPES.MOVE_CHANGED]: [
								{
									guard: PLAYER_GUARD_KEYS.WANTS_RUN,
									target: PLAYER_STATES.MOVEMENT.RUNNING,
									actions: [PLAYER_ACTION_KEYS.ASSIGN_MOVE_VECTOR],
								},
								{
									actions: [PLAYER_ACTION_KEYS.ASSIGN_MOVE_VECTOR],
								},
							],
							[PLAYER_EVENT_TYPES.MOVE_STOPPED]: {
								target: PLAYER_STATES.MOVEMENT.IDLE,
								actions: [PLAYER_ACTION_KEYS.CLEAR_MOVE_VECTOR],
							},
							[PLAYER_EVENT_TYPES.RUN_HELD_CHANGED]: {
								actions: [PLAYER_ACTION_KEYS.ASSIGN_RUN_HELD],
							},
						},
					},
					[PLAYER_STATES.MOVEMENT.RUNNING]: {
						on: {
							[PLAYER_EVENT_TYPES.MOVE_CHANGED]: [
								{
									guard: PLAYER_GUARD_KEYS.WANTS_RUN,
									actions: [PLAYER_ACTION_KEYS.ASSIGN_MOVE_VECTOR],
								},
								{
									target: PLAYER_STATES.MOVEMENT.WALKING,
									actions: [PLAYER_ACTION_KEYS.ASSIGN_MOVE_VECTOR],
								},
							],
							[PLAYER_EVENT_TYPES.MOVE_STOPPED]: {
								target: PLAYER_STATES.MOVEMENT.IDLE,
								actions: [PLAYER_ACTION_KEYS.CLEAR_MOVE_VECTOR],
							},
							[PLAYER_EVENT_TYPES.RUN_HELD_CHANGED]: {
								actions: [PLAYER_ACTION_KEYS.ASSIGN_RUN_HELD],
							},
						},
					},
				},
			},
			[PLAYER_STATES.REGIONS.AIRBORNE]: {
				initial: PLAYER_STATES.AIRBORNE.GROUNDED,
				states: {
					[PLAYER_STATES.AIRBORNE.GROUNDED]: {
						on: {
							[PLAYER_EVENT_TYPES.JUMP_PRESSED]: {
								target: PLAYER_STATES.AIRBORNE.JUMPING,
								actions: [PLAYER_ACTION_KEYS.REQUEST_JUMP_IMPULSE],
							},
							[PLAYER_EVENT_TYPES.LEFT_GROUND]: {
								target: PLAYER_STATES.AIRBORNE.FALLING,
							},
						},
					},
					[PLAYER_STATES.AIRBORNE.JUMPING]: {
						on: {
							[PLAYER_EVENT_TYPES.LANDED]: {
								target: PLAYER_STATES.AIRBORNE.GROUNDED,
								actions: [PLAYER_ACTION_KEYS.CLEAR_JUMP_REQUEST],
							},
						},
					},
					[PLAYER_STATES.AIRBORNE.FALLING]: {
						on: {
							[PLAYER_EVENT_TYPES.LANDED]: {
								target: PLAYER_STATES.AIRBORNE.GROUNDED,
								actions: [PLAYER_ACTION_KEYS.CLEAR_JUMP_REQUEST],
							},
						},
					},
				},
			},
			[PLAYER_STATES.REGIONS.HEALTH]: {
				initial: PLAYER_STATES.HEALTH.ALIVE,
				states: {
					[PLAYER_STATES.HEALTH.ALIVE]: {
						on: {
							[PLAYER_EVENTS.TAKE_DAMAGE]: [
								{
									guard: PLAYER_GUARDS.IS_LETHAL_DAMAGE,
									target: PLAYER_STATES.HEALTH.DEAD,
									actions: assign(({ context }) => ({
										[PLAYER_CONTEXT_KEYS.STATS]: applyDeath(context.stats),
										[PLAYER_CONTEXT_KEYS.VELOCITY]: [
											0, 0, 0,
										] as unknown as Vector3Tuple,
									})),
								},
								{
									target: PLAYER_STATES.HEALTH.DAMAGED,
									actions: assign(({ context, event }) => ({
										[PLAYER_CONTEXT_KEYS.STATS]: applyDamage(
											context.stats,
											(event as PlayerTakeDamageEvent).amount,
										),
									})),
								},
							],
							[PLAYER_EVENTS.DIE]: {
								target: PLAYER_STATES.HEALTH.DEAD,
								actions: assign(({ context }) => ({
									[PLAYER_CONTEXT_KEYS.STATS]: applyDeath(context.stats),
									[PLAYER_CONTEXT_KEYS.VELOCITY]: [
										0, 0, 0,
									] as unknown as Vector3Tuple,
								})),
							},
						},
					},
					[PLAYER_STATES.HEALTH.DAMAGED]: {
						on: {
							[PLAYER_EVENTS.TAKE_DAMAGE]: [
								{
									guard: PLAYER_GUARDS.IS_LETHAL_DAMAGE,
									target: PLAYER_STATES.HEALTH.DEAD,
									actions: assign(({ context }) => ({
										[PLAYER_CONTEXT_KEYS.STATS]: applyDeath(context.stats),
										[PLAYER_CONTEXT_KEYS.VELOCITY]: [
											0, 0, 0,
										] as unknown as Vector3Tuple,
									})),
								},
								{
									actions: assign(({ context, event }) => ({
										[PLAYER_CONTEXT_KEYS.STATS]: applyDamage(
											context.stats,
											(event as PlayerTakeDamageEvent).amount,
										),
									})),
								},
							],
							[PLAYER_EVENTS.HEAL]: {
								target: PLAYER_STATES.HEALTH.ALIVE,
								actions: assign(({ context, event }) => ({
									[PLAYER_CONTEXT_KEYS.STATS]: applyHeal(
										context.stats,
										(event as PlayerHealEvent).amount,
										context.stats.maxHp,
									),
								})),
							},
							[PLAYER_EVENTS.DIE]: {
								target: PLAYER_STATES.HEALTH.DEAD,
								actions: assign(({ context }) => ({
									[PLAYER_CONTEXT_KEYS.STATS]: applyDeath(context.stats),
									[PLAYER_CONTEXT_KEYS.VELOCITY]: [
										0, 0, 0,
									] as unknown as Vector3Tuple,
								})),
							},
						},
					},
					[PLAYER_STATES.HEALTH.DEAD]: {
						on: {
							[PLAYER_EVENTS.RESTART]: {
								target: PLAYER_STATES.HEALTH.ALIVE,
								actions: assign(({ context }) => ({
									[PLAYER_CONTEXT_KEYS.STATS]: {
										...context.stats,
										hp: context.stats.maxHp,
									},
									[PLAYER_CONTEXT_KEYS.VELOCITY]: [
										0, 0, 0,
									] as unknown as Vector3Tuple,
								})),
							},
						},
					},
				},
			},
		},
	});

export type PlayerMachine = ReturnType<typeof createPlayerMachine>;
