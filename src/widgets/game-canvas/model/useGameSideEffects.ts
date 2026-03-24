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
import { AUDIO_SPRITE_IDS, useAudioController } from "@/features/audio-manager";
import { useAuthContext } from "@/features/auth";
import { useGameMachineRuntime } from "@/features/dungeon-navigation";
import { useHaptics } from "@/features/haptics-feedback";
import { SCORE_VALUES } from "@/shared/config";
import { setPlayerTeleportTarget } from "@/shared/lib/playerPositionStore";

import { getRoomWorldPosition, shouldSubmitFloorScore } from "../lib";

export const useGameSideEffects = (): void => {
	const { snapshot } = useGameMachineRuntime();
	const { snapshot: playerSnapshot } = usePlayerMachineRuntime();
	const { onRoomEnter, onTransition, onFloorComplete, onPlayerDeath } =
		useHaptics();
	const { handleSoundEffectPlay } = useAudioController();
	const submitScore = useSubmitDungeonScore();
	const { authenticatedProfile } = useAuthContext();

	const floorRooms = useMemo(
		() => createDungeonFloorLayout(createFloorOneMachine()).rooms,
		[],
	);

	const startTimeMsRef = useRef(Date.now());
	const prevRoomRef = useRef<RoomId | null>(null);
	const hasSubmittedRef = useRef(false);
	const hasTriggeredDeathRef = useRef(false);

	useEffect(() => {
		onTransition();

		const currentRoom = snapshot.context.currentRoomId;

		if (currentRoom !== prevRoomRef.current) {
			onRoomEnter();
			handleSoundEffectPlay(AUDIO_SPRITE_IDS.DOOR_OPEN);

			const roomPosition = getRoomWorldPosition(
				floorRooms,
				currentRoom,
				PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			);
			if (roomPosition) {
				setPlayerTeleportTarget(...roomPosition);
			}

			prevRoomRef.current = currentRoom;
		}
	}, [snapshot, onTransition, onRoomEnter, handleSoundEffectPlay, floorRooms]);

	useEffect(() => {
		if (
			!shouldSubmitFloorScore(
				snapshot.value as string,
				hasSubmittedRef.current,
			)
		) {
			return;
		}

		if (!authenticatedProfile) {
			return;
		}

		hasSubmittedRef.current = true;
		onFloorComplete();
		handleSoundEffectPlay(AUDIO_SPRITE_IDS.ACHIEVEMENT);
		submitScore.mutate({
			userId: authenticatedProfile.id,
			dungeonId: FLOOR_IDS.FLOOR_ONE,
			score:
				snapshot.context.discoveredRooms.length * SCORE_VALUES.ROOM_DISCOVERY,
			timeMs: Date.now() - startTimeMsRef.current,
			roomsDiscovered: snapshot.context.discoveredRooms.length,
		});
	}, [
		snapshot.value,
		snapshot.context.discoveredRooms,
		authenticatedProfile,
		onFloorComplete,
		handleSoundEffectPlay,
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
		handleSoundEffectPlay(AUDIO_SPRITE_IDS.PLAYER_HIT);
	}, [playerSnapshot, onPlayerDeath, handleSoundEffectPlay]);
};
