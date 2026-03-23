import { assign, setup } from "xstate";

import type { Vector3Tuple } from "@/shared/types";

import { PLAYER_EVENTS, PLAYER_MACHINE_DEFAULTS } from "../config";
import type {
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
			isLethalDamage: ({ context, event }) => {
				const e = event as PlayerTakeDamageEvent;
				return context.stats.hp - e.amount <= 0;
			},
			isPlayerAlive: ({ context }) => context.stats.hp > 0,
		},
	}).createMachine({
		id: "playerMachine",
		type: "parallel",
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
			movement: {
				initial: "idle",
				states: {
					idle: {
						on: {
							[PLAYER_EVENTS.MOVE]: {
								guard: "isPlayerAlive",
								target: "walking",
								actions: assign(({ event }) => ({
									velocity: (event as PlayerMoveEvent).velocity,
								})),
							},
						},
					},
					walking: {
						on: {
							[PLAYER_EVENTS.MOVE]: {
								guard: "isPlayerAlive",
								actions: assign(({ event }) => ({
									velocity: (event as PlayerMoveEvent).velocity,
								})),
							},
							[PLAYER_EVENTS.STOP]: {
								target: "idle",
								actions: assign(() => ({
									velocity: [0, 0, 0] as unknown as Vector3Tuple,
								})),
							},
						},
					},
				},
			},
			health: {
				initial: "alive",
				states: {
					alive: {
						on: {
							[PLAYER_EVENTS.TAKE_DAMAGE]: [
								{
									guard: "isLethalDamage",
									target: "dead",
									actions: assign(({ context }) => ({
										stats: { ...context.stats, hp: 0 },
										velocity: [0, 0, 0] as unknown as Vector3Tuple,
									})),
								},
								{
									target: "damaged",
									actions: assign(({ context, event }) => ({
										stats: {
											...context.stats,
											hp:
												context.stats.hp -
												(event as PlayerTakeDamageEvent).amount,
										},
									})),
								},
							],
							[PLAYER_EVENTS.DIE]: {
								target: "dead",
								actions: assign(({ context }) => ({
									stats: { ...context.stats, hp: 0 },
									velocity: [0, 0, 0] as unknown as Vector3Tuple,
								})),
							},
						},
					},
					damaged: {
						on: {
							[PLAYER_EVENTS.TAKE_DAMAGE]: [
								{
									guard: "isLethalDamage",
									target: "dead",
									actions: assign(({ context }) => ({
										stats: { ...context.stats, hp: 0 },
										velocity: [0, 0, 0] as unknown as Vector3Tuple,
									})),
								},
								{
									actions: assign(({ context, event }) => ({
										stats: {
											...context.stats,
											hp:
												context.stats.hp -
												(event as PlayerTakeDamageEvent).amount,
										},
									})),
								},
							],
							[PLAYER_EVENTS.HEAL]: {
								target: "alive",
								actions: assign(({ context, event }) => ({
									stats: {
										...context.stats,
										hp: Math.min(
											context.stats.maxHp,
											context.stats.hp + (event as { amount: number }).amount,
										),
									},
								})),
							},
							[PLAYER_EVENTS.DIE]: {
								target: "dead",
								actions: assign(({ context }) => ({
									stats: { ...context.stats, hp: 0 },
									velocity: [0, 0, 0] as unknown as Vector3Tuple,
								})),
							},
						},
					},
					dead: {},
				},
			},
		},
	});

export type PlayerMachine = ReturnType<typeof createPlayerMachine>;
