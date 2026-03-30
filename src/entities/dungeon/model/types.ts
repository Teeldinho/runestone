import type { FloorId, RoomId } from "@/entities/dungeon/config/dungeonConfig";
import type { DungeonEventObject } from "@/entities/dungeon/config/dungeonEvents";

export type DungeonRuneState = "sealed" | "open" | "active";

export type DoorwayFeedback =
	| "LOCKED_DOOR_ATTEMPT"
	| "LOCKED_EXIT_ATTEMPT"
	| null;

export type DungeonMachineContext = {
	currentFloorId: FloorId;
	currentRoomId: RoomId;
	discoveredRooms: RoomId[];
	hasTreasureKey: boolean;
	enemiesRemaining: number;
	lastDoorwayFeedback?: DoorwayFeedback;
};

export type DungeonMachineEvent = DungeonEventObject;
