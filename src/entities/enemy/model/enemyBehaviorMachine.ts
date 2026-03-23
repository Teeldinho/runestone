import { setup } from "xstate";

import { ENEMY_MACHINE_ID, ENEMY_MACHINE_STATES } from "../config";
import type { EnemyMachineContext, EnemyMachineEvent, EnemyMachineInput } from "./types";

export const createEnemyBehaviorMachine = () =>
	setup({
		types: {
			context: {} as EnemyMachineContext,
			events: {} as EnemyMachineEvent,
			input: {} as EnemyMachineInput,
		},
	}).createMachine({
		id: ENEMY_MACHINE_ID,
		initial: ENEMY_MACHINE_STATES.PATROL,
		context: ({ input }) => ({
			id: input.id,
			roomId: input.roomId,
			position: input.position,
			playerPosition: [0, 0, 0],
			hp: 0,
			maxHp: 0,
		}),
		states: {
			[ENEMY_MACHINE_STATES.PATROL]: {},
			[ENEMY_MACHINE_STATES.DETECT]: {},
			[ENEMY_MACHINE_STATES.CHASE]: {},
			[ENEMY_MACHINE_STATES.ATTACK]: {},
			[ENEMY_MACHINE_STATES.DEAD]: {
				type: "final",
			},
		},
	});

export type EnemyBehaviorMachine = ReturnType<typeof createEnemyBehaviorMachine>;
