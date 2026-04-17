import { useMemo } from "react";

import type { RoomId } from "@/entities/dungeon";

import { useGamePageVisualizer } from "./useGamePageVisualizer";

type UseGamePageVisualizerSliceInput = {
	audioState: unknown;
	cameraMode: unknown;
	currentRoomId: RoomId;
	playerStateValue: unknown;
};

export const useGamePageVisualizerSlice = ({
	audioState,
	cameraMode,
	currentRoomId,
	playerStateValue,
}: UseGamePageVisualizerSliceInput) => {
	const { graphSections } = useGamePageVisualizer({
		audioState,
		cameraMode,
		currentRoomId,
		playerStateValue,
	});

	return useMemo(
		() => ({
			graphSections,
		}),
		[graphSections],
	);
};

export type { UseGamePageVisualizerSliceInput };
