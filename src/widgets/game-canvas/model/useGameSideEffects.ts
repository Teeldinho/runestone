import { useEffect, useMemo, useRef } from "react";

import type { RoomId } from "@/entities/dungeon";
import { createFloorOneMachine, FLOOR_IDS } from "@/entities/dungeon";
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
import { SCORE_VALUES } from "@/shared/config";
import { setPlayerTeleportTarget } from "@/shared/lib/playerPositionStore";

import {
	getDoorwayArrivalPosition,
	getRoomWorldPosition,
	shouldSubmitFloorScore,
} from "../lib";

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

	const startTimeMsRef = useRef(Date.now());
	const prevRoomRef = useRef<RoomId | null>(null);
	const hasAppliedInitialTeleportRef = useRef(false);
	const lastArrivalKeyRef = useRef<string | null>(null);
	const previousDoorwayFeedbackRef = useRef<typeof lastDoorwayFeedback>(null);
	const hasSubmittedRef = useRef(false);
	const hasTriggeredDeathRef = useRef(false);

	useEffect(() => {
		if (currentRoomId !== prevRoomRef.current) {
			onTransition();
			onRoomEnter();

			prevRoomRef.current = currentRoomId;
		}
	}, [currentRoomId, onTransition, onRoomEnter]);

	useEffect(() => {
		const roomPosition = getRoomWorldPosition(
			floorRooms,
			currentRoomId,
			PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
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
				spawnHeightOffset: PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			}),
		);

		hasAppliedInitialTeleportRef.current = true;
		lastArrivalKeyRef.current = arrivalKey;
	}, [currentRoomId, lastTransition, floorRooms]);

	useEffect(() => {
		if (
			lastDoorwayFeedback &&
			lastDoorwayFeedback !== previousDoorwayFeedbackRef.current
		) {
			onGuardFail();
		}

		previousDoorwayFeedbackRef.current = lastDoorwayFeedback;
	}, [lastDoorwayFeedback, onGuardFail]);

	useEffect(() => {
		if (!shouldSubmitFloorScore(activeStateLabel, hasSubmittedRef.current)) {
			return;
		}

		if (!authenticatedProfile) {
			return;
		}

		hasSubmittedRef.current = true;
		onFloorComplete();
		submitScore.mutate({
			userId: authenticatedProfile.id,
			dungeonId: FLOOR_IDS.FLOOR_ONE,
			score: discoveredRooms.length * SCORE_VALUES.ROOM_DISCOVERY,
			timeMs: Date.now() - startTimeMsRef.current,
			roomsDiscovered: discoveredRooms.length,
		});
	}, [
		activeStateLabel,
		discoveredRooms,
		authenticatedProfile,
		onFloorComplete,
		submitScore,
	]);

	useEffect(() => {
		const healthState =
			playerSnapshot.value[
				PLAYER_STATES.REGIONS.HEALTH as keyof typeof playerSnapshot.value
			];

		if (healthState !== PLAYER_STATES.HEALTH.DEAD) {
			hasTriggeredDeathRef.current = false;
			return;
		}

		if (hasTriggeredDeathRef.current) {
			return;
		}

		hasTriggeredDeathRef.current = true;
		onPlayerDeath();
	}, [playerSnapshot, onPlayerDeath]);
};
