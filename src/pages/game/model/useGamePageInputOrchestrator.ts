import { usePlayerMachineRuntime } from "@/entities/player";
import { useGameMachineActorRef } from "@/features/dungeon-navigation";
import {
	useInputOrchestrator,
	useKeyboardInputOrchestrator,
	useKeyboardMovementInput,
	useTouchMovementInput,
} from "@/features/input-orchestrator";

export const useGamePageInputOrchestrator = () => {
	const { playerActorRef } = usePlayerMachineRuntime();
	const gameActorRef = useGameMachineActorRef();

	const input = useInputOrchestrator({
		playerRef: playerActorRef,
		interactionRef: gameActorRef,
	});

	useKeyboardInputOrchestrator({
		sendInput: input.sendInput,
	});

	useKeyboardMovementInput({
		sendInput: input.sendInput,
		isRunToggled: input.isRunToggled,
	});

	const touchMovement = useTouchMovementInput({
		sendInput: input.sendInput,
		isRunToggled: input.isRunToggled,
	});

	return {
		inputStateValue: input.inputStateValue,
		sendInput: input.sendInput,
		isRunToggled: input.isRunToggled,
		touchMovement,
	};
};
