import { useCallback, useEffect, useMemo } from "react";

import { createFloorOneMachine, ROOM_IDS } from "@/entities/dungeon";
import {
	createPlayerMachine,
	PLAYER_ENTITY_CONFIG,
	PLAYER_EVENTS,
	usePlayerMachineRuntime,
} from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import { audioMachine, useAudioController } from "@/features/audio-manager";
import {
	type CameraMachineEvent,
	type CameraStateSnapshot,
	createCameraMachine,
	useCameraMachine,
} from "@/features/camera-system";
import { useGameMachine } from "@/features/dungeon-navigation";
import { useStateVisualizer } from "@/features/state-visualizer";
import { setPlayerTeleportTarget } from "@/shared/lib/playerPositionStore";
import type { CanvasMachineRuntime } from "@/widgets/game-canvas";

import { GAME_PAGE_COPY } from "../config";

type GamePageViewModel = {
	actionButtons: ReturnType<typeof useGameMachine>["actionButtons"];
	activeStateLabel: string;
	cameraStateSnapshot: CameraStateSnapshot;
	canvasMachineRuntime: CanvasMachineRuntime;
	currentRoomLabel: string;
	discoveredRoomLabels: string[];
	enemiesRemaining: number;
	graphSections: ReturnType<typeof useStateVisualizer>["sections"];
	handleAudioMuteToggle: () => void;
	handleCameraModeSwitch: (event: CameraMachineEvent) => void;
	hasTreasureKeyLabel: string;
	handleDungeonRunReset: () => void;
	isAudioMuted: boolean;
	playerHp: number;
	playerMaxHp: number;
};

export const useGamePage = (): GamePageViewModel => {
	const {
		activeStateLabel,
		actionButtons,
		currentRoomLabel,
		currentRoomId,
		discoveredRoomLabels,
		enemiesRemaining,
		handleDungeonRunReset: resetDungeonMachine,
		hasTreasureKey,
	} = useGameMachine();
	const { snapshot: playerSnapshot, sendPlayerMachineEvent } =
		usePlayerMachineRuntime();
	const {
		cameraStateSnapshot,
		handleCameraModeSwitch,
		mode: cameraMode,
	} = useCameraMachine();
	const {
		audioState,
		handleAudioPlayRequest,
		handleAudioMuteToggle,
		isAudioMuted,
	} = useAudioController();

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

	const visualizerMachinesBySectionId = useMemo(
		() => ({
			dungeon: createFloorOneMachine(),
			camera: createCameraMachine(),
			audio: audioMachine,
			player: createPlayerMachine(),
		}),
		[],
	);

	const { sections } = useStateVisualizer({
		machinesBySectionId: visualizerMachinesBySectionId,
		stateValuesBySectionId: {
			dungeon: currentRoomId,
			camera: cameraMode,
			audio: audioState,
			player: playerSnapshot.value,
		},
	});

	return {
		actionButtons,
		activeStateLabel,
		cameraStateSnapshot,
		canvasMachineRuntime: {
			currentRoomId,
			enemiesRemaining,
			hasTreasureKey,
		},
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		graphSections: sections,
		handleAudioMuteToggle,
		handleCameraModeSwitch,
		hasTreasureKeyLabel: hasTreasureKey
			? GAME_PAGE_COPY.TREASURE_KEY_STATUS.ACQUIRED
			: GAME_PAGE_COPY.TREASURE_KEY_STATUS.MISSING,
		handleDungeonRunReset,
		isAudioMuted,
		playerHp: playerSnapshot.context.stats.hp,
		playerMaxHp: playerSnapshot.context.stats.maxHp,
	};
};

export type { GamePageViewModel };
