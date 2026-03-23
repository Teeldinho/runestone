import { usePlayerMachineRuntime } from "@/entities/player";
import { useCameraSystem } from "@/features/camera-system";
import { useGameMachine } from "@/features/dungeon-navigation";
import { useStateVisualizer } from "@/features/state-visualizer";
import type { CanvasMachineRuntime } from "@/widgets/game-canvas";

import { GAME_PAGE_COPY } from "../config";

type GamePageViewModel = {
	actionButtons: ReturnType<typeof useGameMachine>["actionButtons"];
	activeStateLabel: string;
	cameraStateSnapshot: ReturnType<
		typeof useCameraSystem
	>["cameraStateSnapshot"];
	canvasMachineRuntime: CanvasMachineRuntime;
	currentRoomLabel: string;
	discoveredRoomLabels: string[];
	enemiesRemaining: number;
	graphEdges: ReturnType<typeof useStateVisualizer>["edges"];
	graphNodes: ReturnType<typeof useStateVisualizer>["positionedNodes"];
	handleCameraModeSwitch: ReturnType<
		typeof useCameraSystem
	>["handleCameraModeSwitch"];
	hasTreasureKeyLabel: string;
	handleDungeonRunReset: () => void;
	playerHp: number;
	playerMaxHp: number;
};

export const useGamePage = (): GamePageViewModel => {
	const {
		actionButtons,
		currentRoomLabel,
		discoveredRoomLabels,
		handleDungeonRunReset,
		snapshot,
	} = useGameMachine();
	const { cameraStateSnapshot, handleCameraModeSwitch } = useCameraSystem();
	const { snapshot: playerSnapshot } = usePlayerMachineRuntime();

	const { edges, positionedNodes } = useStateVisualizer({
		context: snapshot.context,
	});

	return {
		actionButtons,
		activeStateLabel: String(snapshot.value),
		cameraStateSnapshot,
		canvasMachineRuntime: {
			currentRoomId: snapshot.context.currentRoomId,
			enemiesRemaining: snapshot.context.enemiesRemaining,
			hasTreasureKey: snapshot.context.hasTreasureKey,
		},
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining: snapshot.context.enemiesRemaining,
		graphEdges: edges,
		graphNodes: positionedNodes,
		handleCameraModeSwitch,
		hasTreasureKeyLabel: snapshot.context.hasTreasureKey
			? GAME_PAGE_COPY.TREASURE_KEY_STATUS.ACQUIRED
			: GAME_PAGE_COPY.TREASURE_KEY_STATUS.MISSING,
		handleDungeonRunReset,
		playerHp: playerSnapshot.context.stats.hp,
		playerMaxHp: playerSnapshot.context.stats.maxHp,
	};
};

export type { GamePageViewModel };
