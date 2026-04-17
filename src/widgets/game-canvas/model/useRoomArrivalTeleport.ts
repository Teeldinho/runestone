import { useEffect, useRef } from "react";

import type { LastTransition, RoomId } from "@/entities/dungeon";
import type { DungeonRoomLayout } from "@/entities/room";
import { setPlayerTeleportTarget } from "@/shared/lib";

import { getDoorwayArrivalPosition, getRoomWorldPosition } from "../lib";

type UseRoomArrivalTeleportInput = {
	currentRoomId: RoomId;
	lastTransition: LastTransition | null;
	floorRooms: DungeonRoomLayout[];
	spawnHeightOffset: number;
};

export const useRoomArrivalTeleport = ({
	currentRoomId,
	lastTransition,
	floorRooms,
	spawnHeightOffset,
}: UseRoomArrivalTeleportInput): void => {
	const hasAppliedInitialTeleportRef = useRef(false);
	const lastArrivalKeyRef = useRef<string | null>(null);

	useEffect(() => {
		const roomPosition = getRoomWorldPosition(
			floorRooms,
			currentRoomId,
			spawnHeightOffset,
		);

		if (!roomPosition) {
			return;
		}

		const hasTransitionForCurrentRoom =
			lastTransition?.toRoom === currentRoomId;
		const arrivalKey = hasTransitionForCurrentRoom
			? `${currentRoomId}:${lastTransition.fromRoom}:${lastTransition.toRoom}:${lastTransition.doorSide}`
			: hasAppliedInitialTeleportRef.current
				? null
				: `${currentRoomId}:initial`;

		if (!arrivalKey || lastArrivalKeyRef.current === arrivalKey) {
			return;
		}

		setPlayerTeleportTarget(
			...getDoorwayArrivalPosition({
				currentRoomPosition: roomPosition,
				lastTransition: hasTransitionForCurrentRoom ? lastTransition : null,
				spawnHeightOffset,
			}),
		);

		hasAppliedInitialTeleportRef.current = true;
		lastArrivalKeyRef.current = arrivalKey;
	}, [currentRoomId, floorRooms, lastTransition, spawnHeightOffset]);
};

export type { UseRoomArrivalTeleportInput };
