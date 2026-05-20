import type { UseGamePageTouchInput } from "./useGamePageTouch";
import { useGamePageTouch } from "./useGamePageTouch";

export const useGamePageTouchSlice = ({
	handleDungeonEventSend,
}: UseGamePageTouchInput) => {
	const {
		handleTouchAttack,
		handleTouchInteract,
		hasTouchAttack,
		hasTouchInteract,
		touchAttackPrompt,
		touchInteractPrompt,
	} = useGamePageTouch({
		handleDungeonEventSend,
	});

	return {
		handleTouchAttack,
		handleTouchInteract,
		hasTouchAttack,
		hasTouchInteract,
		touchAttackPrompt,
		touchInteractPrompt,
	};
};
