import { useCallback, useMemo } from "react";

import { createFloorOneMachine, ROOM_IDS } from "@/entities/dungeon";
import {
	PLAYER_ENTITY_CONFIG,
	PLAYER_EVENTS,
	usePlayerMachineRuntime,
} from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import { useCameraSystem } from "@/features/camera-system";
import { useGameMachine } from "@/features/dungeon-navigation";
import { useStateVisualizer } from "@/features/state-visualizer";
import { setPlayerTeleportTarget } from "@/shared/lib/playerPositionStore";
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
		handleDungeonRunReset: resetDungeonMachine,
		snapshot,
	} = useGameMachine();
	const { cameraStateSnapshot, handleCameraModeSwitch } = useCameraSystem();
	const { snapshot: playerSnapshot, sendPlayerMachineEvent } =
		usePlayerMachineRuntime();

	const entrancePosition = useMemo(() => {
		const floorLayout = createDungeonFloorLayout(createFloorOneMachine());
		const entrance = floorLayout.rooms.find(
			(room) => room.roomId === ROOM_IDS.ENTRANCE,
		);
		return entrance
			? [
					entrance.position[0],
					PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
					entrance.position[2],
				]
			: [0, PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET, 0];
	}, []);

	const handleDungeonRunReset = useCallback(() => {
		sendPlayerMachineEvent({ type: PLAYER_EVENTS.RESTART });
		setPlayerTeleportTarget(
			entrancePosition[0],
			entrancePosition[1],
			entrancePosition[2],
		);
		resetDungeonMachine();
	}, [sendPlayerMachineEvent, resetDungeonMachine, entrancePosition]);

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
