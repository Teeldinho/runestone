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
import {
	getPlayerPositionSnapshot,
	subscribeToPlayerPosition,
} from "@/shared/model";

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

	const sendEventRef = useRef(sendDungeonMachineEvent);
	sendEventRef.current = sendDungeonMachineEvent;

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

	useEffect(() => {
		const checkProximity = () => {
			const roomCenterPosition = roomPositionById[currentRoomId as RoomId];

			const nearbyInteractable = roomCenterPosition
				? resolveNearInteractableTarget({
						currentRoomId,
						roomCenterPosition,
						playerPosition: getPlayerPositionSnapshot(),
						hasTreasureKey,
						enemiesRemaining,
					})
				: null;

			const previousInteractableId = lastSentNearInteractableRef.current;
			const currentInteractableId = nearbyInteractable?.interactableId ?? null;

			if (previousInteractableId !== currentInteractableId) {
				if (previousInteractableId) {
					sendEventRef.current({
						type: DUNGEON_EVENTS.LEFT_INTERACTABLE,
						interactableId: previousInteractableId,
					});
				}

				if (nearbyInteractable) {
					sendEventRef.current({
						type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
						interactableId: nearbyInteractable.interactableId,
						interactableType: nearbyInteractable.interactableType,
					});
				}

				lastSentNearInteractableRef.current = currentInteractableId;
			}
		};

		checkProximity();

		return subscribeToPlayerPosition(checkProximity);
	}, [roomPositionById, currentRoomId, enemiesRemaining, hasTreasureKey]);
};
