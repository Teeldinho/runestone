import type { UseGamePageTouchInput } from "./useGamePageTouch";
import { useGamePageTouch } from "./useGamePageTouch";

export const useGamePageTouchSlice = ({
	handleDungeonEventSend,
	sendPlayerMachineEvent,
}: UseGamePageTouchInput) => {
	const {
		handleTouchAttack,
		handleTouchInteract,
		handleTouchJoystickMove,
		handleTouchJoystickStop,
		hasTouchAttack,
		hasTouchInteract,
		touchAttackPrompt,
		touchInteractPrompt,
	} = useGamePageTouch({
		handleDungeonEventSend,
		sendPlayerMachineEvent,
	});

	return {
		handleTouchAttack,
		handleTouchInteract,
		handleTouchJoystickMove,
		handleTouchJoystickStop,
		hasTouchAttack,
		hasTouchInteract,
		touchAttackPrompt,
		touchInteractPrompt,
	};
};
