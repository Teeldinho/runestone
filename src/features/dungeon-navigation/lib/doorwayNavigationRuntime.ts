import type { DungeonInteractableId, RoomId } from "@/entities/dungeon";
import { createFloorOneMachine, DUNGEON_EVENTS } from "@/entities/dungeon";
import { createDungeonFloorLayout } from "@/entities/room";
import type { Vector3Tuple } from "@/shared/lib";
import {
	getPlayerPositionSnapshot,
	subscribeToPlayerPosition,
} from "@/shared/model";
import { resolveNearInteractableTarget } from "./doorwayNavigation";

export type DoorwayNavigationContext = {
	currentRoomId: RoomId;
	enemiesRemaining: number;
	hasTreasureKey: boolean;
};

// Assuming the type accepted by sendDungeonMachineEvent matches standard dungeon transitions
export type SendDungeonMachineEventFn = (event: {
	type: string;
	interactableId?: DungeonInteractableId;
	interactableType?: string;
}) => void;

// Precompute room positions statically to avoid doing it per-instance or per-frame
const layout = createDungeonFloorLayout(createFloorOneMachine());
const ROOM_POSITION_BY_ID = layout.rooms.reduce(
	(acc, room) => {
		acc[room.roomId as RoomId] = room.position;
		return acc;
	},
	{} as Record<RoomId, Vector3Tuple>,
);

export const createDoorwayNavigationRuntime = (
	context: DoorwayNavigationContext,
	sendEvent: SendDungeonMachineEventFn,
) => {
	let lastSentInteractableId: DungeonInteractableId | null = null;

	const checkProximity = () => {
		const roomCenterPosition = ROOM_POSITION_BY_ID[context.currentRoomId];

		const nearbyInteractable = roomCenterPosition
			? resolveNearInteractableTarget({
					currentRoomId: context.currentRoomId,
					roomCenterPosition,
					playerPosition: getPlayerPositionSnapshot(),
					hasTreasureKey: context.hasTreasureKey,
					enemiesRemaining: context.enemiesRemaining,
				})
			: null;

		const currentInteractableId = nearbyInteractable?.interactableId ?? null;

		if (lastSentInteractableId !== currentInteractableId) {
			if (lastSentInteractableId) {
				sendEvent({
					type: DUNGEON_EVENTS.LEFT_INTERACTABLE,
					interactableId: lastSentInteractableId,
				});
			}

			if (nearbyInteractable) {
				sendEvent({
					type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
					interactableId: nearbyInteractable.interactableId,
					interactableType: nearbyInteractable.interactableType,
				});
			}

			lastSentInteractableId = currentInteractableId;
		}
	};

	const subscribe = (): (() => void) => {
		checkProximity();

		return subscribeToPlayerPosition(checkProximity);
	};

	return { subscribe };
};
