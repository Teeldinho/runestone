import { usePlayerMachineRuntime } from "@/entities/player";
import { useCameraMachine } from "@/features/camera-system";
import {
	useGameMachine,
	useGameMachineActorRef,
} from "@/features/dungeon-navigation";
import { useResponsiveGameLayout } from "@/features/responsive-layout";

import { deriveIsMobileTabletLandscape } from "../lib/deriveIsMobileTabletLandscape";

type GamePageMachineState = {
	gameMachine: ReturnType<typeof useGameMachine>;
	playerMachine: Pick<
		ReturnType<typeof usePlayerMachineRuntime>,
		"snapshot" | "sendPlayerMachineEvent" | "playerActorRef"
	>;
	cameraMachine: Pick<
		ReturnType<typeof useCameraMachine>,
		"cameraStateSnapshot" | "handleCameraModeSwitch" | "mode"
	>;
	layout: {
		isDesktopLayout: boolean;
		isMobileTabletLandscape: boolean;
		isTabletLayout: boolean;
	};
	playerActorRef: ReturnType<typeof usePlayerMachineRuntime>["playerActorRef"];
	gameActorRef: ReturnType<typeof useGameMachineActorRef>;
};

export const useGamePageMachineState = (): GamePageMachineState => {
	const gameMachine = useGameMachine();
	const { snapshot, sendPlayerMachineEvent, playerActorRef } =
		usePlayerMachineRuntime();
	const { cameraStateSnapshot, handleCameraModeSwitch, mode } =
		useCameraMachine();
	const gameActorRef = useGameMachineActorRef();

	const { isDesktopLayout, isLandscape, isTabletLayout } =
		useResponsiveGameLayout();

	return {
		cameraMachine: {
			cameraStateSnapshot,
			handleCameraModeSwitch,
			mode,
		},
		gameMachine,
		layout: {
			isDesktopLayout,
			isMobileTabletLandscape: deriveIsMobileTabletLandscape(
				isDesktopLayout,
				isLandscape,
			),
			isTabletLayout,
		},
		playerMachine: {
			sendPlayerMachineEvent,
			snapshot,
			playerActorRef,
		},
		playerActorRef,
		gameActorRef,
	};
};

export type { GamePageMachineState };
