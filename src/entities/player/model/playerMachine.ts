import { assign, setup } from "xstate";

import { MACHINE_STATE_TYPES } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";

import {
	PLAYER_EVENTS,
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
	PlayerMoveEvent,
	PlayerTakeDamageEvent,
} from "./types";

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
		},
	}).createMachine({
		id: PLAYER_MACHINE_ID,
		type: MACHINE_STATE_TYPES.PARALLEL,
		context: {
			position: [
				...PLAYER_MACHINE_DEFAULTS.POSITION,
			] as unknown as Vector3Tuple,
			velocity: [
				...PLAYER_MACHINE_DEFAULTS.VELOCITY,
			] as unknown as Vector3Tuple,
			stats: {
				maxHp: PLAYER_MACHINE_DEFAULTS.STATS.MAX_HP,
				hp: PLAYER_MACHINE_DEFAULTS.STATS.HP,
				score: PLAYER_MACHINE_DEFAULTS.STATS.SCORE,
				keyCount: PLAYER_MACHINE_DEFAULTS.STATS.KEY_COUNT,
				chainMultiplier: PLAYER_MACHINE_DEFAULTS.STATS.CHAIN_MULTIPLIER,
			},
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
									velocity: (event as PlayerMoveEvent).velocity,
								})),
							},
						},
					},
					[PLAYER_STATES.MOVEMENT.WALKING]: {
						on: {
							[PLAYER_EVENTS.MOVE]: {
								guard: PLAYER_GUARDS.IS_PLAYER_ALIVE,
								actions: assign(({ event }) => ({
									velocity: (event as PlayerMoveEvent).velocity,
								})),
							},
							[PLAYER_EVENTS.STOP]: {
								target: PLAYER_STATES.MOVEMENT.IDLE,
								actions: assign(() => ({
									velocity: [0, 0, 0] as unknown as Vector3Tuple,
								})),
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
										stats: applyDeath(context.stats),
										velocity: [0, 0, 0] as unknown as Vector3Tuple,
									})),
								},
								{
									target: PLAYER_STATES.HEALTH.DAMAGED,
									actions: assign(({ context, event }) => ({
										stats: applyDamage(
											context.stats,
											(event as PlayerTakeDamageEvent).amount,
										),
									})),
								},
							],
							[PLAYER_EVENTS.DIE]: {
								target: PLAYER_STATES.HEALTH.DEAD,
								actions: assign(({ context }) => ({
									stats: applyDeath(context.stats),
									velocity: [0, 0, 0] as unknown as Vector3Tuple,
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
										stats: applyDeath(context.stats),
										velocity: [0, 0, 0] as unknown as Vector3Tuple,
									})),
								},
								{
									actions: assign(({ context, event }) => ({
										stats: applyDamage(
											context.stats,
											(event as PlayerTakeDamageEvent).amount,
										),
									})),
								},
							],
							[PLAYER_EVENTS.HEAL]: {
								target: PLAYER_STATES.HEALTH.ALIVE,
								actions: assign(({ context, event }) => ({
									stats: applyHeal(
										context.stats,
										(event as PlayerHealEvent).amount,
										context.stats.maxHp,
									),
								})),
							},
							[PLAYER_EVENTS.DIE]: {
								target: PLAYER_STATES.HEALTH.DEAD,
								actions: assign(({ context }) => ({
									stats: applyDeath(context.stats),
									velocity: [0, 0, 0] as unknown as Vector3Tuple,
								})),
							},
						},
					},
					[PLAYER_STATES.HEALTH.DEAD]: {},
				},
			},
		},
	});

export type PlayerMachine = ReturnType<typeof createPlayerMachine>;
