import { shallowEqual } from "@xstate/react";
import { useEffect, useMemo, useRef } from "react";

import {
	createFloorOneMachine,
	DUNGEON_EVENTS,
	type DungeonInteractableId,
	type RoomId,
} from "@/entities/dungeon";
import { createDungeonFloorLayout } from "@/entities/room";
import type { Vector3Tuple } from "@/shared/lib";
import { usePlayerPositionSnapshotValue } from "@/shared/model";

import { resolveNearInteractableTarget } from "../lib";
import {
	selectDoorwayNavigationContext,
	useGameMachineSelector,
	useSendDungeonMachineEvent,
} from "./gameMachineRuntime";

export const useDoorwayNavigation = (): void => {
	const { currentRoomId, enemiesRemaining, hasTreasureKey } =
		useGameMachineSelector(selectDoorwayNavigationContext, shallowEqual);
	const sendDungeonMachineEvent = useSendDungeonMachineEvent();
	const playerPosition = usePlayerPositionSnapshotValue();

	const roomPositionById = useMemo(() => {
		const layout = createDungeonFloorLayout(createFloorOneMachine());

		return layout.rooms.reduce(
			(accumulator, room) => {
				accumulator[room.roomId as RoomId] = room.position;
				return accumulator;
			},
			{} as Record<RoomId, Vector3Tuple>,
		);
	}, []);

	const lastSentNearInteractableRef = useRef<DungeonInteractableId | null>(
		null,
	);

	const nearbyInteractable = useMemo(() => {
		const roomCenterPosition = roomPositionById[currentRoomId as RoomId];

		if (!roomCenterPosition) {
			return null;
		}

		return resolveNearInteractableTarget({
			currentRoomId,
			roomCenterPosition,
			playerPosition,
			hasTreasureKey,
			enemiesRemaining,
		});
	}, [
		roomPositionById,
		currentRoomId,
		enemiesRemaining,
		hasTreasureKey,
		playerPosition,
	]);

	useEffect(() => {
		const previousInteractableId = lastSentNearInteractableRef.current;

		if (!nearbyInteractable) {
			if (previousInteractableId) {
				sendDungeonMachineEvent({
					type: DUNGEON_EVENTS.LEFT_INTERACTABLE,
					interactableId: previousInteractableId,
				});
				lastSentNearInteractableRef.current = null;
			}
			return;
		}

		if (previousInteractableId !== nearbyInteractable.interactableId) {
			if (previousInteractableId) {
				sendDungeonMachineEvent({
					type: DUNGEON_EVENTS.LEFT_INTERACTABLE,
					interactableId: previousInteractableId,
				});
			}

			sendDungeonMachineEvent({
				type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
				interactableId: nearbyInteractable.interactableId,
				interactableType: nearbyInteractable.interactableType,
			});
			lastSentNearInteractableRef.current = nearbyInteractable.interactableId;
		}
	}, [nearbyInteractable, sendDungeonMachineEvent]);
};
