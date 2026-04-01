import type { DoorStateKey, DungeonMachineContext } from "../model/types";

export const isDoorOpened = (
	context: DungeonMachineContext,
	doorKey: DoorStateKey,
): boolean => context.openedDoors.includes(doorKey);

export const canEnterRoomViaDoor = (
	context: DungeonMachineContext,
	doorKey: DoorStateKey,
): boolean => context.openedDoors.includes(doorKey);
