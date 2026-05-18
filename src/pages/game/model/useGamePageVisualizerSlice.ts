import type { RoomId } from "@/entities/dungeon";

import { useGamePageVisualizer } from "./useGamePageVisualizer";

type UseGamePageVisualizerSliceInput = {
	audioState: unknown;
	cameraMode: unknown;
	currentRoomId: RoomId;
	inputStateValue: unknown;
	playerStateValue: unknown;
};

export const useGamePageVisualizerSlice = ({
	audioState,
	cameraMode,
	currentRoomId,
	inputStateValue,
	playerStateValue,
}: UseGamePageVisualizerSliceInput) => {
	const { graphSections } = useGamePageVisualizer({
		audioState,
		cameraMode,
		currentRoomId,
		inputStateValue,
		playerStateValue,
	});

	return {
		graphSections,
	};
};

export type { UseGamePageVisualizerSliceInput };
