import { useEffect, useMemo, useRef } from "react";

import {
	buildDoorKey,
	createFloorOneMachine,
	type DoorStateKey,
	DUNGEON_EVENTS,
	type RoomId,
} from "@/entities/dungeon";
import { createDungeonFloorLayout } from "@/entities/room";
import {
	getPlayerPosition,
	subscribeToPlayerPosition,
} from "@/shared/lib/playerPositionStore";
import type { Vector3Tuple } from "@/shared/types";

import { DOORWAY_NAVIGATION_CONFIG } from "../config";
import {
	checkPlayerWithinRoomBounds,
	resolveDoorwayEntrySide,
	resolveDoorwayNavigationEvent,
} from "../lib";
import { useGameMachineRuntime } from "./gameMachineRuntime";

export const useDoorwayNavigation = (): void => {
	const { snapshot, sendDungeonMachineEvent } = useGameMachineRuntime();

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

	const lastDoorwayTriggerKeyRef = useRef<string | null>(null);
	const blockedDoorwayKeyRef = useRef<string | null>(null);
	const lastTriggerAtMsRef = useRef(0);
	const previousRoomIdRef = useRef<RoomId | null>(
		snapshot.context.currentRoomId as RoomId,
	);
	const lastSentNearInteractableRef = useRef<DoorStateKey | null>(null);

	const send = sendDungeonMachineEvent;

	useEffect(() => {
		const currentRoomId = snapshot.context.currentRoomId as RoomId;
		if (previousRoomIdRef.current !== currentRoomId) {
			const currentRoomPosition = roomPositionById[currentRoomId];
			const previousRoomPosition = previousRoomIdRef.current
				? roomPositionById[previousRoomIdRef.current]
				: null;
			const blockedDoorwaySide =
				currentRoomPosition && previousRoomPosition
					? resolveDoorwayEntrySide({
							currentRoomPosition,
							previousRoomPosition,
						})
					: null;

			blockedDoorwayKeyRef.current = blockedDoorwaySide
				? `${currentRoomId}:${blockedDoorwaySide}`
				: null;
			previousRoomIdRef.current = currentRoomId;
		}

		const runDoorwayCheck = () => {
			const currentRoomId = snapshot.context.currentRoomId as RoomId;
			const roomCenterPosition = roomPositionById[currentRoomId];
			if (!roomCenterPosition) {
				if (lastSentNearInteractableRef.current) {
					send({
						type: DUNGEON_EVENTS.LEFT_INTERACTABLE,
						doorKey: lastSentNearInteractableRef.current,
					});
					lastSentNearInteractableRef.current = null;
				}
				return;
			}

			const doorwayEvent = resolveDoorwayNavigationEvent({
				currentRoomId,
				roomCenterPosition,
				playerPosition: getPlayerPosition(),
				hasTreasureKey: snapshot.context.hasTreasureKey,
				enemiesRemaining: snapshot.context.enemiesRemaining,
			});
			const isPlayerInsideCurrentRoom = checkPlayerWithinRoomBounds({
				roomCenterPosition,
				playerPosition: getPlayerPosition(),
			});

			if (!doorwayEvent) {
				lastDoorwayTriggerKeyRef.current = null;
				if (lastSentNearInteractableRef.current) {
					send({
						type: DUNGEON_EVENTS.LEFT_INTERACTABLE,
						doorKey: lastSentNearInteractableRef.current,
					});
					lastSentNearInteractableRef.current = null;
				}
				if (blockedDoorwayKeyRef.current && isPlayerInsideCurrentRoom) {
					blockedDoorwayKeyRef.current = null;
				}
				return;
			}

			if (
				blockedDoorwayKeyRef.current ===
				`${currentRoomId}:${doorwayEvent.doorSide}`
			) {
				return;
			}

			const doorwayTriggerKey = `${currentRoomId}:${doorwayEvent.doorSide}:${doorwayEvent.eventType}`;
			if (doorwayTriggerKey === lastDoorwayTriggerKeyRef.current) {
				return;
			}

			const now = Date.now();
			if (
				now - lastTriggerAtMsRef.current <
				DOORWAY_NAVIGATION_CONFIG.TRIGGER_COOLDOWN_MS
			) {
				return;
			}

			lastDoorwayTriggerKeyRef.current = doorwayTriggerKey;
			lastTriggerAtMsRef.current = now;

			const doorKey = buildDoorKey(currentRoomId, doorwayEvent.doorSide);
			const interactableType = doorwayEvent.isLocked ? "door" : "door";

			if (lastSentNearInteractableRef.current !== doorKey) {
				if (lastSentNearInteractableRef.current) {
					send({
						type: DUNGEON_EVENTS.LEFT_INTERACTABLE,
						doorKey: lastSentNearInteractableRef.current,
					});
				}
				send({
					type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
					doorKey,
					interactableType,
				});
				lastSentNearInteractableRef.current = doorKey;
			}
		};

		const unsubscribe = subscribeToPlayerPosition(runDoorwayCheck);
		runDoorwayCheck();

		return () => {
			unsubscribe();
		};
	}, [
		roomPositionById,
		snapshot.context.currentRoomId,
		snapshot.context.enemiesRemaining,
		snapshot.context.hasTreasureKey,
		send,
	]);
};
