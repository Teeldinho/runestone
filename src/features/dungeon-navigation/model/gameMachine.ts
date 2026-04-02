import { assign, setup } from "xstate";

import {
	createFloorOneContext,
	createFloorOneMachine,
	DUNGEON_MACHINE_IDS,
	type DungeonContext,
	FLOOR_ONE_GUARD_IMPLEMENTATIONS,
} from "@/entities/dungeon";
import {
	DUNGEON_MACHINE_SYSTEM_EVENTS,
	type GameMachineEvent,
} from "../config";

export const createGameMachine = (options?: {
	context?: Partial<DungeonContext>;
}) => {
	const floorOneMachine = createFloorOneMachine({
		context: options?.context,
	});

	return setup({
		types: {
			context: {} as DungeonContext,
			events: {} as GameMachineEvent,
		},
		guards: FLOOR_ONE_GUARD_IMPLEMENTATIONS,
	}).createMachine({
		id: DUNGEON_MACHINE_IDS.NAVIGATION,
		initial: floorOneMachine.config.initial as DungeonContext["currentRoomId"],
		context: floorOneMachine.config.context as DungeonContext,
		on: {
			...(floorOneMachine.config.on ?? {}),
			[DUNGEON_MACHINE_SYSTEM_EVENTS.RESET_DUNGEON_RUN]: {
				target: `.${floorOneMachine.config.initial as string}`,
				actions: assign(() => createFloorOneContext(options?.context)),
			},
		} as never,
		states: floorOneMachine.config.states,
	});
};
