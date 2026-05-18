import { useMemo } from "react";

import type { RoomId } from "@/entities/dungeon";
import { createPlayerMachine } from "@/entities/player";
import { audioMachine } from "@/features/audio-manager";
import { createCameraMachine } from "@/features/camera-system";
import { createGameMachine } from "@/features/dungeon-navigation";
import { inputOrchestratorMachine } from "@/features/input-orchestrator";
import {
	STATE_VISUALIZER_SECTION_IDS,
	useStateVisualizer,
} from "@/features/state-visualizer";

type UseGamePageVisualizerInput = {
	audioState: unknown;
	cameraMode: unknown;
	currentRoomId: RoomId;
	inputStateValue: unknown;
	playerStateValue: unknown;
};

type GamePageVisualizerViewModel = {
	graphSections: ReturnType<typeof useStateVisualizer>["sections"];
};

export const useGamePageVisualizer = ({
	audioState,
	cameraMode,
	currentRoomId,
	inputStateValue,
	playerStateValue,
}: UseGamePageVisualizerInput): GamePageVisualizerViewModel => {
	const visualizerMachinesBySectionId = useMemo(
		() => ({
			[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: createGameMachine(),
			[STATE_VISUALIZER_SECTION_IDS.CAMERA]: createCameraMachine(),
			[STATE_VISUALIZER_SECTION_IDS.AUDIO]: audioMachine,
			[STATE_VISUALIZER_SECTION_IDS.INPUT]: inputOrchestratorMachine,
			[STATE_VISUALIZER_SECTION_IDS.PLAYER]: createPlayerMachine(),
		}),
		[],
	);

	const serializedInputStateValue = JSON.stringify(inputStateValue);
	const serializedPlayerStateValue = JSON.stringify(playerStateValue);
	const serializedAudioState = JSON.stringify(audioState);

	const stateValuesBySectionId = useMemo(
		() => ({
			[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: currentRoomId,
			[STATE_VISUALIZER_SECTION_IDS.CAMERA]: cameraMode,
			[STATE_VISUALIZER_SECTION_IDS.AUDIO]: JSON.parse(serializedAudioState),
			[STATE_VISUALIZER_SECTION_IDS.INPUT]: JSON.parse(
				serializedInputStateValue,
			),
			[STATE_VISUALIZER_SECTION_IDS.PLAYER]: JSON.parse(
				serializedPlayerStateValue,
			),
		}),
		[
			currentRoomId,
			cameraMode,
			serializedAudioState,
			serializedInputStateValue,
			serializedPlayerStateValue,
		],
	);

	const { sections } = useStateVisualizer({
		machinesBySectionId: visualizerMachinesBySectionId,
		stateValuesBySectionId,
	});

	return {
		graphSections: sections,
	};
};

export type { GamePageVisualizerViewModel, UseGamePageVisualizerInput };
