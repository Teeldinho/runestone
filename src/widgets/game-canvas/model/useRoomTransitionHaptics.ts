import { useEffect, useRef } from "react";

import type { RoomId } from "@/entities/dungeon";

type UseRoomTransitionHapticsInput = {
	currentRoomId: RoomId;
	onRoomEnter: () => void;
	onTransition: () => void;
};

export const useRoomTransitionHaptics = ({
	currentRoomId,
	onRoomEnter,
	onTransition,
}: UseRoomTransitionHapticsInput): void => {
	const previousRoomRef = useRef<RoomId | null>(null);

	useEffect(() => {
		if (currentRoomId === previousRoomRef.current) {
			return;
		}

		onTransition();
		onRoomEnter();
		previousRoomRef.current = currentRoomId;
	}, [currentRoomId, onRoomEnter, onTransition]);
};

export type { UseRoomTransitionHapticsInput };
