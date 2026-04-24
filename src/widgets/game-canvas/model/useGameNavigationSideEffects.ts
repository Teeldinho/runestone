import type { LastTransition, RoomId } from "@/entities/dungeon";
import type { DungeonRoomLayout } from "@/entities/room";

import { useDoorwayGuardFeedback } from "./useDoorwayGuardFeedback";
import { useRoomArrivalTeleport } from "./useRoomArrivalTeleport";
import { useRoomTransitionHaptics } from "./useRoomTransitionHaptics";

type UseGameNavigationSideEffectsInput = {
	currentRoomId: RoomId;
	floorRooms: DungeonRoomLayout[];
	lastDoorwayFeedback: string | null | undefined;
	lastTransition: LastTransition | null;
	onGuardFail: () => void;
	onRoomEnter: () => void;
	onTransition: () => void;
	spawnHeightOffset: number;
};

export const useGameNavigationSideEffects = ({
	currentRoomId,
	floorRooms,
	lastDoorwayFeedback,
	lastTransition,
	onGuardFail,
	onRoomEnter,
	onTransition,
	spawnHeightOffset,
}: UseGameNavigationSideEffectsInput): void => {
	useRoomTransitionHaptics({
		currentRoomId,
		onRoomEnter,
		onTransition,
	});

	useRoomArrivalTeleport({
		currentRoomId,
		lastTransition,
		floorRooms,
		spawnHeightOffset,
	});

	useDoorwayGuardFeedback({
		lastDoorwayFeedback,
		onGuardFail,
	});
};

export type { UseGameNavigationSideEffectsInput };
