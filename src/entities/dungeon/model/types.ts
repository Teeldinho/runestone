import type { FloorId, RoomId } from "@/entities/dungeon/config/dungeonConfig";
import type { DungeonEventObject } from "@/entities/dungeon/config/dungeonEvents";

export type DungeonRuneState = "sealed" | "open" | "active";

export type DungeonMachineContext = {
	currentFloorId: FloorId;
	currentRoomId: RoomId;
	discoveredRooms: RoomId[];
	hasTreasureKey: boolean;
	enemiesRemaining: number;
};

export type DungeonMachineEvent = DungeonEventObject;
