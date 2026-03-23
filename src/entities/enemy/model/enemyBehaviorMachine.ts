import { assign, not, setup } from "xstate";

import { ENEMY_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";

import {
	ENEMY_ACTIONS,
	ENEMY_DETECT_DELAY_MS,
	ENEMY_EVENTS,
	ENEMY_GUARDS,
	ENEMY_MACHINE_DEFAULTS,
	ENEMY_MACHINE_ID,
	ENEMY_MACHINE_STATES,
} from "../config";
import {
	checkIsLethalDamageForEnemy,
	checkIsPlayerInAttackRange,
	checkIsPlayerInDetectionRange,
	resolvePlayerPosition,
} from "../lib";
import type {
	EnemyMachineContext,
	EnemyMachineEvent,
	EnemyMachineInput,
	EnemyTakeDamageEvent,
} from "./types";

export const createEnemyBehaviorMachine = () =>
	setup({
		types: {
			context: {} as EnemyMachineContext,
			events: {} as EnemyMachineEvent,
			input: {} as EnemyMachineInput,
		},
		guards: {
			[ENEMY_GUARDS.IS_PLAYER_IN_DETECTION_RANGE]: ({ context, event }) =>
				checkIsPlayerInDetectionRange(
					context.position,
					resolvePlayerPosition(
						event as { position?: Vector3Tuple },
						context.playerPosition,
					),
					ENEMY_CONFIG.DETECTION_RADIUS,
				),
			[ENEMY_GUARDS.IS_PLAYER_IN_ATTACK_RANGE]: ({ context, event }) =>
				checkIsPlayerInAttackRange(
					context.position,
					resolvePlayerPosition(
						event as { position?: Vector3Tuple },
						context.playerPosition,
					),
					ENEMY_CONFIG.ATTACK_RADIUS,
				),
			[ENEMY_GUARDS.IS_LETHAL_DAMAGE]: ({ context, event }) =>
				checkIsLethalDamageForEnemy(
					context.hp,
					(event as EnemyTakeDamageEvent).amount,
				),
		},
		actions: {
			[ENEMY_ACTIONS.SYNC_PLAYER_POSITION]: assign(({ context, event }) => ({
				playerPosition: resolvePlayerPosition(
					event as { position?: Vector3Tuple },
					context.playerPosition,
				),
			})),
			[ENEMY_ACTIONS.APPLY_DAMAGE]: assign(({ context, event }) => ({
				hp: Math.max(context.hp - (event as EnemyTakeDamageEvent).amount, 0),
			})),
			[ENEMY_ACTIONS.APPLY_DEATH]: assign(() => ({ hp: 0 })),
		},
	}).createMachine({
		id: ENEMY_MACHINE_ID,
		initial: ENEMY_MACHINE_STATES.PATROL,
		context: ({ input }) => ({
			id: input.id,
			roomId: input.roomId,
			position: input.position,
			playerPosition: [
				...ENEMY_MACHINE_DEFAULTS.PLAYER_POSITION,
			] as unknown as Vector3Tuple,
			hp: ENEMY_MACHINE_DEFAULTS.HP,
			maxHp: ENEMY_MACHINE_DEFAULTS.MAX_HP,
		}),
		states: {
			[ENEMY_MACHINE_STATES.PATROL]: {
				on: {
					[ENEMY_EVENTS.UPDATE_PLAYER_POSITION]: [
						{
							guard: ENEMY_GUARDS.IS_PLAYER_IN_DETECTION_RANGE,
							target: ENEMY_MACHINE_STATES.DETECT,
							actions: ENEMY_ACTIONS.SYNC_PLAYER_POSITION,
						},
						{ actions: ENEMY_ACTIONS.SYNC_PLAYER_POSITION },
					],
				},
			},
			[ENEMY_MACHINE_STATES.DETECT]: {
				after: {
					[ENEMY_DETECT_DELAY_MS]: [
						{
							guard: ENEMY_GUARDS.IS_PLAYER_IN_DETECTION_RANGE,
							target: ENEMY_MACHINE_STATES.CHASE,
						},
						{ target: ENEMY_MACHINE_STATES.PATROL },
					],
				},
				on: {
					[ENEMY_EVENTS.UPDATE_PLAYER_POSITION]: [
						{
							guard: not(ENEMY_GUARDS.IS_PLAYER_IN_DETECTION_RANGE),
							target: ENEMY_MACHINE_STATES.PATROL,
							actions: ENEMY_ACTIONS.SYNC_PLAYER_POSITION,
						},
						{ actions: ENEMY_ACTIONS.SYNC_PLAYER_POSITION },
					],
				},
			},
			[ENEMY_MACHINE_STATES.CHASE]: {
				on: {
					[ENEMY_EVENTS.UPDATE_PLAYER_POSITION]: [
						{
							guard: ENEMY_GUARDS.IS_PLAYER_IN_ATTACK_RANGE,
							target: ENEMY_MACHINE_STATES.ATTACK,
							actions: ENEMY_ACTIONS.SYNC_PLAYER_POSITION,
						},
						{
							guard: not(ENEMY_GUARDS.IS_PLAYER_IN_DETECTION_RANGE),
							target: ENEMY_MACHINE_STATES.PATROL,
							actions: ENEMY_ACTIONS.SYNC_PLAYER_POSITION,
						},
						{ actions: ENEMY_ACTIONS.SYNC_PLAYER_POSITION },
					],
				},
			},
			[ENEMY_MACHINE_STATES.ATTACK]: {
				on: {
					[ENEMY_EVENTS.TAKE_DAMAGE]: [
						{
							guard: ENEMY_GUARDS.IS_LETHAL_DAMAGE,
							target: ENEMY_MACHINE_STATES.DEAD,
							actions: ENEMY_ACTIONS.APPLY_DEATH,
						},
						{ actions: ENEMY_ACTIONS.APPLY_DAMAGE },
					],
					[ENEMY_EVENTS.UPDATE_PLAYER_POSITION]: [
						{
							guard: not(ENEMY_GUARDS.IS_PLAYER_IN_DETECTION_RANGE),
							target: ENEMY_MACHINE_STATES.PATROL,
							actions: ENEMY_ACTIONS.SYNC_PLAYER_POSITION,
						},
						{ actions: ENEMY_ACTIONS.SYNC_PLAYER_POSITION },
					],
				},
			},
			[ENEMY_MACHINE_STATES.DEAD]: {
				type: "final",
			},
		},
	});

export type EnemyBehaviorMachine = ReturnType<
	typeof createEnemyBehaviorMachine
>;
