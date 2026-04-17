import type { RoomId } from "@/entities/dungeon";
import type {
	CameraMachineEvent,
	CameraStateSnapshot,
} from "@/features/camera-system";
import type { Vector3Tuple } from "@/shared/lib";
import type { CanvasMachineRuntime } from "@/widgets/game-canvas";

import type { useGamePageMachineState } from "./useGamePageMachineState";
import type { GamePageMobileSheetTabId } from "./useGamePageMobileSheet";
import type { useGamePageVisualizer } from "./useGamePageVisualizer";

type GamePageViewModel = {
	actionButtons: ReturnType<
		typeof useGamePageMachineState
	>["gameMachine"]["actionButtons"];
	activeStateLabel: string;
	cameraStateSnapshot: CameraStateSnapshot;
	canvasMachineRuntime: CanvasMachineRuntime;
	currentRoomLabel: string;
	discoveredRoomLabels: string[];
	enemiesRemaining: number;
	graphSections: ReturnType<typeof useGamePageVisualizer>["graphSections"];
	handleAudioMuteToggle: () => void;
	handleCameraModeSwitch: (event: CameraMachineEvent) => void;
	handleDungeonRunReset: () => void;
	handleMobileSheetOpenChange: (isOpen: boolean) => void;
	handleMobileSheetTabChange: (tabId: string) => void;
	handleTouchJoystickMove: (velocity: Vector3Tuple) => void;
	handleTouchJoystickStop: () => void;
	handleTouchAttack: () => void;
	handleTouchInteract: () => void;
	hasTouchAttack: boolean;
	hasTouchInteract: boolean;
	hasTreasureKeyLabel: string;
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

type CreateGamePageViewModelInput = Omit<
	GamePageViewModel,
	"canvasMachineRuntime"
> & {
	currentRoomId: RoomId;
	hasTreasureKey: boolean;
};

export type { CreateGamePageViewModelInput, GamePageViewModel };
