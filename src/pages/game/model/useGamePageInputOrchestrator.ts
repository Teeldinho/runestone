import { PLAYER_STATES, usePlayerMachineRuntime } from "@/entities/player";
import { useGameMachineActorRef } from "@/features/dungeon-navigation";
import {
	useInputOrchestrator,
	useKeyboardInputOrchestrator,
	useTouchLookInput,
	useTouchMovementInput,
} from "@/features/input-orchestrator";

import { useGamePageCanvasContext } from "./useGamePageSliceContexts";

export const useGamePageInputOrchestrator = () => {
	const { snapshot, playerActorRef } = usePlayerMachineRuntime();
	const { cameraActorRef } = useGamePageCanvasContext();
	const gameActorRef = useGameMachineActorRef();
	const airborneState =
		snapshot.value[PLAYER_STATES.REGIONS.AIRBORNE] ??
		PLAYER_STATES.AIRBORNE.GROUNDED;
	const isJumpActive = airborneState !== PLAYER_STATES.AIRBORNE.GROUNDED;

	const input = useInputOrchestrator({
		playerRef: playerActorRef,
		cameraRef: cameraActorRef,
		interactionRef: gameActorRef,
	});

	useKeyboardInputOrchestrator({
		sendInput: input.sendInput,
	});

	const touchLook = useTouchLookInput({
		sendInput: input.sendInput,
	});

	const touchMovement = useTouchMovementInput({
		sendInput: input.sendInput,
		isDesktopRunHeld: input.isDesktopRunHeld,
		isMobileRunToggled: input.isMobileRunToggled,
	});

	return {
		sendInput: input.sendInput,
		isDesktopRunHeld: input.isDesktopRunHeld,
		isJumpActive,
		isMobileRunToggled: input.isMobileRunToggled,
		touchLook,
		touchMovement,
	};
};
