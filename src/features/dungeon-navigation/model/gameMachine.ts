import { assign, setup } from "xstate";

import {
	createFloorOneContext,
	createFloorOneMachine,
	type DungeonContext,
	FLOOR_ONE_GUARDS,
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
		guards: FLOOR_ONE_GUARDS,
	}).createMachine({
		id: "dungeonNavigationMachine",
		initial: floorOneMachine.config.initial as DungeonContext["currentRoomId"],
		context: floorOneMachine.config.context as DungeonContext,
		on: {
			[DUNGEON_MACHINE_SYSTEM_EVENTS.RESET_DUNGEON_RUN]: {
				target: `.${floorOneMachine.config.initial as string}`,
				actions: assign(() => createFloorOneContext(options?.context)),
			},
		},
		states: floorOneMachine.config.states,
	});
};
