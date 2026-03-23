import { useEffect, useRef } from "react";

import type { RoomId } from "@/entities/dungeon";
import { FLOOR_IDS } from "@/entities/dungeon";
import { useSubmitDungeonScore } from "@/entities/score";
import { useAudioController } from "@/features/audio-manager";
import { useAuthContext } from "@/features/auth";
import { useGameMachineRuntime } from "@/features/dungeon-navigation";
import { useHaptics } from "@/features/haptics-feedback";
import { SCORE_VALUES, XSTATE_ACTOR_STATUS } from "@/shared/config";

export const useGameSideEffects = (): void => {
	const { snapshot } = useGameMachineRuntime();
	const { onRoomEnter, onTransition, onFloorComplete } = useHaptics();
	const { handleSoundEffectPlay } = useAudioController();
	const submitScore = useSubmitDungeonScore();
	const { authenticatedProfile } = useAuthContext();

	const startTimeMsRef = useRef(Date.now());
	const prevRoomRef = useRef<RoomId | null>(null);
	const hasSubmittedRef = useRef(false);

	useEffect(() => {
		onTransition();

		const currentRoom = snapshot.context.currentRoomId;

		if (currentRoom !== prevRoomRef.current) {
			onRoomEnter();
			handleSoundEffectPlay("DOOR_OPEN");
			prevRoomRef.current = currentRoom;
		}
	}, [snapshot, onTransition, onRoomEnter, handleSoundEffectPlay]);

	useEffect(() => {
		if (
			snapshot.status !== XSTATE_ACTOR_STATUS.DONE ||
			hasSubmittedRef.current
		) {
			return;
		}

		if (!authenticatedProfile) {
			return;
		}

		hasSubmittedRef.current = true;
		onFloorComplete();
		handleSoundEffectPlay("ACHIEVEMENT");
		submitScore.mutate({
			userId: authenticatedProfile.id,
			dungeonId: FLOOR_IDS.FLOOR_ONE,
			score:
				snapshot.context.discoveredRooms.length * SCORE_VALUES.ROOM_DISCOVERY,
			timeMs: Date.now() - startTimeMsRef.current,
			roomsDiscovered: snapshot.context.discoveredRooms.length,
		});
	}, [
		snapshot.status,
		snapshot.context.discoveredRooms,
		authenticatedProfile,
		onFloorComplete,
		handleSoundEffectPlay,
		submitScore,
	]);
};
