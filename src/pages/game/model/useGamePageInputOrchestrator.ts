import {
	useInputOrchestrator,
	useKeyboardInputOrchestrator,
	useTouchLookInput,
	useTouchMovementInput,
} from "@/features/input-orchestrator";

import { useGamePageMachineState } from "./useGamePageMachineState";

export const useGamePageInputOrchestrator = () => {
	const { playerActorRef, cameraActorRef, gameActorRef } =
		useGamePageMachineState();

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
		isMobileRunToggled: input.isMobileRunToggled,
		touchLook,
		touchMovement,
	};
};
