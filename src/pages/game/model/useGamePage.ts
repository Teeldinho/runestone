import { useCallback, useEffect, useMemo, useState } from "react";

import type { DungeonEvent } from "@/entities/dungeon";
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
import {
	useGameMachine,
	useInteractionCandidates,
	useInteractionInput,
} from "@/features/dungeon-navigation";
import { useResponsiveGameLayout } from "@/features/responsive-layout";
import {
	STATE_VISUALIZER_SECTION_IDS,
	useStateVisualizer,
} from "@/features/state-visualizer";
import type { Vector3Tuple } from "@/shared/lib";
import { setPlayerTeleportTarget } from "@/shared/lib";
import type { CanvasMachineRuntime } from "@/widgets/game-canvas";

import { GAME_PAGE_COPY, GAME_PAGE_MOBILE_SHEET } from "../config";

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
	handleMobileSheetOpenChange: (isOpen: boolean) => void;
	handleMobileSheetTabChange: (tabId: string) => void;
	handleTouchJoystickMove: (velocity: Vector3Tuple) => void;
	handleTouchJoystickStop: () => void;
	handleTouchAttack: () => void;
	handleTouchInteract: () => void;
	hasTouchAttack: boolean;
	hasTouchInteract: boolean;
	isAudioMuted: boolean;
	isDesktopLayout: boolean;
	isMobileSheetOpen: boolean;
	isMobileTabletLandscape: boolean;
	isTabletLayout: boolean;
	mobileSheetTabId: GamePageMobileSheetTabId;
	playerHp: number;
	playerMaxHp: number;
	touchAttackPrompt: string | null;
	touchInteractPrompt: string | null;
};

type GamePageMobileSheetTabId =
	(typeof GAME_PAGE_MOBILE_SHEET.TAB_IDS)[keyof typeof GAME_PAGE_MOBILE_SHEET.TAB_IDS];

export const useGamePage = (): GamePageViewModel => {
	const {
		activeStateLabel,
		actionButtons,
		currentRoomLabel,
		currentRoomId,
		discoveredRoomLabels,
		enemiesRemaining,
		handleDungeonEventSend,
		handleDungeonRunReset: resetDungeonMachine,
		hasTreasureKey,
	} = useGameMachine();
	const interactionCandidates = useInteractionCandidates();
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
	const { isDesktopLayout, isLandscape, isTabletLayout } =
		useResponsiveGameLayout();
	const isMobileTabletLandscape = !isDesktopLayout && isLandscape;
	const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
	const [mobileSheetTabId, setMobileSheetTabId] =
		useState<GamePageMobileSheetTabId>(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
		);
	const sendDungeonMachineEvent = useCallback(
		(event: { type: DungeonEvent }) => {
			handleDungeonEventSend(event.type);
		},
		[handleDungeonEventSend],
	);
	const touchInteractionHandlers = useInteractionInput({
		candidates: interactionCandidates,
		enableKeyboardBindings: false,
		sendDungeonMachineEvent,
	});

	useEffect(() => {
		if (!isMobileTabletLandscape) {
			return;
		}

		const previousBodyOverflow = document.body.style.overflow;
		const previousBodyOverscrollBehavior =
			document.body.style.overscrollBehavior;
		const previousHtmlOverflow = document.documentElement.style.overflow;
		const previousHtmlOverscrollBehavior =
			document.documentElement.style.overscrollBehavior;

		document.body.style.overflow = "hidden";
		document.body.style.overscrollBehavior = "none";
		document.documentElement.style.overflow = "hidden";
		document.documentElement.style.overscrollBehavior = "none";

		return () => {
			document.body.style.overflow = previousBodyOverflow;
			document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
			document.documentElement.style.overflow = previousHtmlOverflow;
			document.documentElement.style.overscrollBehavior =
				previousHtmlOverscrollBehavior;
		};
	}, [isMobileTabletLandscape]);

	useEffect(() => {
		handleAudioPlayRequest();
	}, [handleAudioPlayRequest]);

	const entrancePosition = useMemo(() => {
		const floorLayout = createDungeonFloorLayout(createFloorOneMachine());
		const entrance = floorLayout.rooms.find(
			(room) => room.roomId === ROOM_IDS.ENTRANCE,
		);

		if (entrance) {
			const [entranceX, , entranceZ] = entrance.position;

			return [
				entranceX,
				PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
				entranceZ,
			] as const;
		}

		return [0, PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET, 0] as const;
	}, []);

	const handleDungeonRunReset = useCallback(() => {
		const [teleportX, teleportY, teleportZ] = entrancePosition;

		sendPlayerMachineEvent({ type: PLAYER_EVENTS.RESTART });
		setPlayerTeleportTarget(teleportX, teleportY, teleportZ);
		resetDungeonMachine();
	}, [sendPlayerMachineEvent, resetDungeonMachine, entrancePosition]);

	const handleTouchJoystickMove = useCallback(
		(velocity: Vector3Tuple) => {
			sendPlayerMachineEvent({
				type: PLAYER_EVENTS.MOVE,
				velocity,
				isSprinting: false,
			});
		},
		[sendPlayerMachineEvent],
	);

	const handleTouchJoystickStop = useCallback(() => {
		sendPlayerMachineEvent({ type: PLAYER_EVENTS.STOP });
	}, [sendPlayerMachineEvent]);

	const handleMobileSheetOpenChange = useCallback((isOpen: boolean) => {
		setIsMobileSheetOpen(isOpen);
	}, []);

	const handleMobileSheetTabChange = useCallback((tabId: string) => {
		if (
			tabId !== GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART &&
			tabId !== GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD
		) {
			return;
		}

		setMobileSheetTabId(tabId as GamePageMobileSheetTabId);
	}, []);

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
			[STATE_VISUALIZER_SECTION_IDS.PLAYER]: playerSnapshot.value,
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
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
		handleTouchJoystickMove,
		handleTouchJoystickStop,
		handleTouchAttack: touchInteractionHandlers.handleAttack,
		handleTouchInteract: touchInteractionHandlers.handleInteract,
		hasTouchAttack: interactionCandidates.hasAttack,
		hasTouchInteract: interactionCandidates.hasInteract,
		isAudioMuted,
		isDesktopLayout,
		isMobileSheetOpen,
		isMobileTabletLandscape,
		isTabletLayout,
		mobileSheetTabId,
		playerHp: playerSnapshot.context.stats.hp,
		playerMaxHp: playerSnapshot.context.stats.maxHp,
		touchAttackPrompt: interactionCandidates.attackPrompt,
		touchInteractPrompt: interactionCandidates.interactPrompt,
	};
};

export type { GamePageViewModel };
