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
import { useGameNavigationSideEffects } from "./useGameNavigationSideEffects";
import { useGameProgressionSideEffects } from "./useGameProgressionSideEffects";

type UseGameSideEffectsInput = {
	hapticsEnabled?: boolean;
};

export const useGameSideEffects = ({
	hapticsEnabled = true,
}: UseGameSideEffectsInput = {}): void => {
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
	} = useHaptics({ hapticsEnabled });
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

	useGameNavigationSideEffects({
		currentRoomId: currentRoomId as RoomId,
		floorRooms,
		lastDoorwayFeedback,
		lastTransition,
		onGuardFail,
		onRoomEnter,
		onTransition,
		spawnHeightOffset: PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
	});

	useGameProgressionSideEffects({
		activeStateLabel,
		authenticatedProfile,
		deadState: PLAYER_STATES.HEALTH.DEAD,
		discoveredRooms,
		healthState: String(healthState),
		onFloorComplete,
		onPlayerDeath,
		submitScore,
	});
};
