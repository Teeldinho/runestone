import { useMemo } from "react";

import type { RoomId } from "@/entities/dungeon";
import { createFloorOneMachine } from "@/entities/dungeon";
import {
	PLAYER_ENTITY_CONFIG,
	PLAYER_STATES,
	usePlayerMachineRuntime,
} from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import { useSubmitDungeonScore } from "@/entities/score";
import { useAuthContext } from "@/features/auth";
import {
	selectActiveStateLabel,
	selectCurrentRoomId,
	selectDiscoveredRooms,
	selectLastDoorwayFeedback,
	selectLastTransition,
	useGameMachineSelector,
} from "@/features/dungeon-navigation";
import { useHaptics } from "@/features/haptics-feedback";
import { useDoorwayGuardFeedback } from "./useDoorwayGuardFeedback";
import { useFloorCompletionScoreSubmission } from "./useFloorCompletionScoreSubmission";
import { usePlayerDeathHaptic } from "./usePlayerDeathHaptic";
import { useRoomArrivalTeleport } from "./useRoomArrivalTeleport";
import { useRoomTransitionHaptics } from "./useRoomTransitionHaptics";

export const useGameSideEffects = (): void => {
	const activeStateLabel = useGameMachineSelector(selectActiveStateLabel);
	const currentRoomId = useGameMachineSelector(selectCurrentRoomId);
	const discoveredRooms = useGameMachineSelector(selectDiscoveredRooms);
	const lastDoorwayFeedback = useGameMachineSelector(selectLastDoorwayFeedback);
	const lastTransition = useGameMachineSelector(selectLastTransition);
	const { snapshot: playerSnapshot } = usePlayerMachineRuntime();
	const {
		onGuardFail,
		onRoomEnter,
		onTransition,
		onFloorComplete,
		onPlayerDeath,
	} = useHaptics();
	const submitScore = useSubmitDungeonScore();
	const { authenticatedProfile } = useAuthContext();

	const floorRooms = useMemo(
		() => createDungeonFloorLayout(createFloorOneMachine()).rooms,
		[],
	);

	const healthState =
		playerSnapshot.value[
			PLAYER_STATES.REGIONS.HEALTH as keyof typeof playerSnapshot.value
		];

	useRoomTransitionHaptics({
		currentRoomId: currentRoomId as RoomId,
		onRoomEnter,
		onTransition,
	});

	useRoomArrivalTeleport({
		currentRoomId: currentRoomId as RoomId,
		lastTransition,
		floorRooms,
		spawnHeightOffset: PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
	});

	useDoorwayGuardFeedback({
		lastDoorwayFeedback,
		onGuardFail,
	});

	useFloorCompletionScoreSubmission({
		activeStateLabel,
		discoveredRooms,
		authenticatedProfile,
		onFloorComplete,
		submitScore,
	});

	usePlayerDeathHaptic({
		healthState: String(healthState),
		deadState: PLAYER_STATES.HEALTH.DEAD,
		onPlayerDeath,
	});
};
