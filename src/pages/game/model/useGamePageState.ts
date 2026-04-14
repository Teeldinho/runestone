import { useMemo } from "react";

import { createFloorOneMachine } from "@/entities/dungeon";
import {
	createPlayerMachine,
	usePlayerMachineRuntime,
} from "@/entities/player";
import { audioMachine, useAudioController } from "@/features/audio-manager";
import {
	createCameraMachine,
	useCameraMachine,
} from "@/features/camera-system";
import { useGameMachine } from "@/features/dungeon-navigation";
import {
	STATE_VISUALIZER_SECTION_IDS,
	useStateVisualizer,
} from "@/features/state-visualizer";

import { GAME_PAGE_COPY } from "../config";

export const useGamePageState = () => {
	const {
		activeStateLabel,
		actionButtons,
		currentRoomLabel,
		currentRoomId,
		discoveredRoomLabels,
		enemiesRemaining,
		hasTreasureKey,
	} = useGameMachine();
	const { snapshot: playerSnapshot } = usePlayerMachineRuntime();
	const { audioState } = useAudioController();
	const { mode: cameraMode } = useCameraMachine();

	const visualizerMachinesBySectionId = useMemo(
		() => ({
			[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: createFloorOneMachine(),
			[STATE_VISUALIZER_SECTION_IDS.CAMERA]: createCameraMachine(),
			[STATE_VISUALIZER_SECTION_IDS.AUDIO]: audioMachine,
			[STATE_VISUALIZER_SECTION_IDS.PLAYER]: createPlayerMachine(),
		}),
		[],
	);

	const { sections: graphSections } = useStateVisualizer({
		machinesBySectionId: visualizerMachinesBySectionId,
		stateValuesBySectionId: {
			[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: currentRoomId,
			[STATE_VISUALIZER_SECTION_IDS.CAMERA]: cameraMode,
			[STATE_VISUALIZER_SECTION_IDS.AUDIO]: audioState,
			[STATE_VISUALIZER_SECTION_IDS.PLAYER]: playerSnapshot.value,
		},
	});

	return {
		actionButtons,
		activeStateLabel,
		canvasMachineRuntime: {
			currentRoomId,
			enemiesRemaining,
			hasTreasureKey,
		},
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		graphSections,
		hasTreasureKeyLabel: hasTreasureKey
			? GAME_PAGE_COPY.TREASURE_KEY_STATUS.ACQUIRED
			: GAME_PAGE_COPY.TREASURE_KEY_STATUS.MISSING,
		playerHp: playerSnapshot.context.stats.hp,
		playerMaxHp: playerSnapshot.context.stats.maxHp,
	};
};
