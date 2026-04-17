import { useMemo } from "react";

import type { RoomId } from "@/entities/dungeon";
import { createFloorOneMachine } from "@/entities/dungeon";
import { createPlayerMachine } from "@/entities/player";
import { audioMachine } from "@/features/audio-manager";
import { createCameraMachine } from "@/features/camera-system";
import {
	STATE_VISUALIZER_SECTION_IDS,
	useStateVisualizer,
} from "@/features/state-visualizer";

type UseGamePageVisualizerInput = {
	audioState: unknown;
	cameraMode: unknown;
	currentRoomId: RoomId;
	playerStateValue: unknown;
};

type GamePageVisualizerViewModel = {
	graphSections: ReturnType<typeof useStateVisualizer>["sections"];
};

export const useGamePageVisualizer = ({
	audioState,
	cameraMode,
	currentRoomId,
	playerStateValue,
}: UseGamePageVisualizerInput): GamePageVisualizerViewModel => {
	const visualizerMachinesBySectionId = useMemo(
		() => ({
			[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: createFloorOneMachine(),
			[STATE_VISUALIZER_SECTION_IDS.CAMERA]: createCameraMachine(),
			[STATE_VISUALIZER_SECTION_IDS.AUDIO]: audioMachine,
			[STATE_VISUALIZER_SECTION_IDS.PLAYER]: createPlayerMachine(),
		}),
		[],
	);

	const { sections } = useStateVisualizer({
		machinesBySectionId: visualizerMachinesBySectionId,
		stateValuesBySectionId: {
			[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: currentRoomId,
			[STATE_VISUALIZER_SECTION_IDS.CAMERA]: cameraMode,
			[STATE_VISUALIZER_SECTION_IDS.AUDIO]: audioState,
			[STATE_VISUALIZER_SECTION_IDS.PLAYER]: playerStateValue,
		},
	});

	return {
		graphSections: sections,
	};
};

export type { GamePageVisualizerViewModel, UseGamePageVisualizerInput };
