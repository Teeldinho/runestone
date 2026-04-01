import type { FloorId, RoomId } from "@/entities/dungeon/config/dungeonConfig";
import type {
	DoorStateKey,
	DungeonEventObject,
	InteractionType,
} from "@/entities/dungeon/config/dungeonEvents";

export type { DoorStateKey, InteractionType };

export type DungeonRuneState = "sealed" | "open" | "active";

export type DoorwayFeedback =
	| "LOCKED_DOOR_ATTEMPT"
	| "LOCKED_EXIT_ATTEMPT"
	| null;

export type LastTransition = {
	fromRoom: RoomId;
	toRoom: RoomId;
	doorSide: string;
};

export type DungeonMachineContext = {
	currentFloorId: FloorId;
	currentRoomId: RoomId;
	discoveredRooms: RoomId[];
	hasTreasureKey: boolean;
	enemiesRemaining: number;
	lastDoorwayFeedback?: DoorwayFeedback;
	openedDoors: DoorStateKey[];
	nearInteractable: DoorStateKey | null;
	nearInteractableType: InteractionType | null;
	lastTransition: LastTransition | null;
};

export type DungeonMachineEvent = DungeonEventObject;
