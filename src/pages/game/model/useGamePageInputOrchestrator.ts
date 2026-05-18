import { PLAYER_STATES, usePlayerMachineRuntime } from "@/entities/player";
import { useGameMachineActorRef } from "@/features/dungeon-navigation";
import {
	useInputOrchestrator,
	useKeyboardInputOrchestrator,
	useTouchMovementInput,
} from "@/features/input-orchestrator";

export const useGamePageInputOrchestrator = () => {
	const { snapshot, playerActorRef } = usePlayerMachineRuntime();
	const gameActorRef = useGameMachineActorRef();

	const airborneState =
		snapshot.value[PLAYER_STATES.REGIONS.AIRBORNE] ??
		PLAYER_STATES.AIRBORNE.GROUNDED;

	const isJumpActive = airborneState !== PLAYER_STATES.AIRBORNE.GROUNDED;

	const input = useInputOrchestrator({
		playerRef: playerActorRef,
		interactionRef: gameActorRef,
	});

	useKeyboardInputOrchestrator({
		sendInput: input.sendInput,
	});

	const touchMovement = useTouchMovementInput({
		sendInput: input.sendInput,
		isDesktopRunHeld: input.isDesktopRunHeld,
		isMobileRunToggled: input.isMobileRunToggled,
	});

	return {
		inputStateValue: input.inputStateValue,
		sendInput: input.sendInput,
		isDesktopRunHeld: input.isDesktopRunHeld,
		isJumpActive,
		isMobileRunToggled: input.isMobileRunToggled,
		touchMovement,
	};
};
