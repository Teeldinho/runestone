import { useEffect, useMemo, useRef } from "react";

import { createFloorOneMachine, type RoomId } from "@/entities/dungeon";
import { createDungeonFloorLayout } from "@/entities/room";
import { getPlayerPosition } from "@/shared/lib/playerPositionStore";
import type { Vector3Tuple } from "@/shared/types";

import { DOORWAY_NAVIGATION_CONFIG } from "../config";
import { resolveDoorwayNavigationEvent } from "../lib";
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
	const lastTriggerAtMsRef = useRef(0);

	useEffect(() => {
		const runDoorwayCheck = () => {
			const currentRoomId = snapshot.context.currentRoomId as RoomId;
			const roomCenterPosition = roomPositionById[currentRoomId];
			if (!roomCenterPosition) {
				return;
			}

			const doorwayEvent = resolveDoorwayNavigationEvent({
				currentRoomId,
				roomCenterPosition,
				playerPosition: getPlayerPosition(),
				hasTreasureKey: snapshot.context.hasTreasureKey,
				enemiesRemaining: snapshot.context.enemiesRemaining,
			});

			if (!doorwayEvent) {
				lastDoorwayTriggerKeyRef.current = null;
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

			sendDungeonMachineEvent({ type: doorwayEvent.eventType });
		};

		const intervalId = window.setInterval(
			runDoorwayCheck,
			DOORWAY_NAVIGATION_CONFIG.CHECK_INTERVAL_MS,
		);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [
		roomPositionById,
		sendDungeonMachineEvent,
		snapshot.context.currentRoomId,
		snapshot.context.enemiesRemaining,
		snapshot.context.hasTreasureKey,
	]);
};
