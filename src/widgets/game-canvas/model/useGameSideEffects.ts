import { useEffect, useRef } from "react";

import type { RoomId } from "@/entities/dungeon";
import { useAudioController } from "@/features/audio-manager";
import { useGameMachineRuntime } from "@/features/dungeon-navigation";
import { useHaptics } from "@/features/haptics-feedback";

export const useGameSideEffects = (): void => {
	const { snapshot } = useGameMachineRuntime();
	const { onRoomEnter, onTransition } = useHaptics();
	const { handleSoundEffectPlay } = useAudioController();

	const prevRoomRef = useRef<RoomId | null>(null);

	useEffect(() => {
		onTransition();

		const currentRoom = snapshot.context.currentRoomId;

		if (currentRoom !== prevRoomRef.current) {
			onRoomEnter();
			handleSoundEffectPlay("DOOR_OPEN");
			prevRoomRef.current = currentRoom;
		}
	}, [snapshot, onTransition, onRoomEnter, handleSoundEffectPlay]);
};
