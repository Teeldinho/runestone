import { useCallback, useEffect, useMemo } from "react";

import { createFloorOneMachine, ROOM_IDS } from "@/entities/dungeon";
import {
	PLAYER_ENTITY_CONFIG,
	PLAYER_EVENTS,
	usePlayerMachineRuntime,
} from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import { useAudioController } from "@/features/audio-manager";
import { useGameMachine } from "@/features/dungeon-navigation";
import { useStateVisualizer } from "@/features/state-visualizer";
import { setPlayerTeleportTarget } from "@/shared/lib/playerPositionStore";
import type { CanvasMachineRuntime } from "@/widgets/game-canvas";

import { GAME_PAGE_COPY } from "../config";

type GamePageViewModel = {
	actionButtons: ReturnType<typeof useGameMachine>["actionButtons"];
	activeStateLabel: string;
	canvasMachineRuntime: CanvasMachineRuntime;
	currentRoomLabel: string;
	discoveredRoomLabels: string[];
	enemiesRemaining: number;
	graphEdges: ReturnType<typeof useStateVisualizer>["edges"];
	graphNodes: ReturnType<typeof useStateVisualizer>["positionedNodes"];
	handleAudioMuteToggle: () => void;
	hasTreasureKeyLabel: string;
	handleDungeonRunReset: () => void;
	isAudioMuted: boolean;
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
	const { snapshot: playerSnapshot, sendPlayerMachineEvent } =
		usePlayerMachineRuntime();
	const { handleAudioPlayRequest, handleAudioMuteToggle, isAudioMuted } =
		useAudioController();

	useEffect(() => {
		handleAudioPlayRequest();
	}, [handleAudioPlayRequest]);

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
		handleAudioMuteToggle,
		hasTreasureKeyLabel: snapshot.context.hasTreasureKey
			? GAME_PAGE_COPY.TREASURE_KEY_STATUS.ACQUIRED
			: GAME_PAGE_COPY.TREASURE_KEY_STATUS.MISSING,
		handleDungeonRunReset,
		isAudioMuted,
		playerHp: playerSnapshot.context.stats.hp,
		playerMaxHp: playerSnapshot.context.stats.maxHp,
	};
};

export type { GamePageViewModel };
