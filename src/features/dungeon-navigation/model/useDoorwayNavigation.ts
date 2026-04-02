import { shallowEqual } from "@xstate/react";
import { useEffect, useMemo, useRef } from "react";

import {
	createFloorOneMachine,
	DUNGEON_EVENTS,
	type DungeonInteractableId,
	type RoomId,
} from "@/entities/dungeon";
import { createDungeonFloorLayout } from "@/entities/room";
import {
	getPlayerPosition,
	subscribeToPlayerPosition,
} from "@/shared/lib/playerPositionStore";
import type { Vector3Tuple } from "@/shared/types";

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

	const send = sendDungeonMachineEvent;

	useEffect(() => {
		const runDoorwayCheck = () => {
			const roomCenterPosition = roomPositionById[currentRoomId as RoomId];
			if (!roomCenterPosition) {
				if (lastSentNearInteractableRef.current) {
					send({
						type: DUNGEON_EVENTS.LEFT_INTERACTABLE,
						interactableId: lastSentNearInteractableRef.current,
					});
					lastSentNearInteractableRef.current = null;
				}
				return;
			}

			const nearbyInteractable = resolveNearInteractableTarget({
				currentRoomId,
				roomCenterPosition,
				playerPosition: getPlayerPosition(),
				hasTreasureKey,
				enemiesRemaining,
			});

			if (!nearbyInteractable) {
				if (lastSentNearInteractableRef.current) {
					send({
						type: DUNGEON_EVENTS.LEFT_INTERACTABLE,
						interactableId: lastSentNearInteractableRef.current,
					});
					lastSentNearInteractableRef.current = null;
				}
				return;
			}

			if (
				lastSentNearInteractableRef.current !==
				nearbyInteractable.interactableId
			) {
				if (lastSentNearInteractableRef.current) {
					send({
						type: DUNGEON_EVENTS.LEFT_INTERACTABLE,
						interactableId: lastSentNearInteractableRef.current,
					});
				}
				send({
					type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
					interactableId: nearbyInteractable.interactableId,
					interactableType: nearbyInteractable.interactableType,
				});
				lastSentNearInteractableRef.current = nearbyInteractable.interactableId;
			}
		};

		const unsubscribe = subscribeToPlayerPosition(runDoorwayCheck);
		runDoorwayCheck();

		return () => {
			unsubscribe();
		};
	}, [roomPositionById, currentRoomId, enemiesRemaining, hasTreasureKey, send]);
};
