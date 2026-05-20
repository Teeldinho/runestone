import { PLAYER_STATES } from "../config";
import type { PlayerMovementState } from "../model";

type ResolvePlayerRunningIndicatorVisibilityInput = {
	readonly isAvatarVisible: boolean;
	readonly isDesktopLayout: boolean;
	readonly movementState: PlayerMovementState;
};

export const resolvePlayerRunningIndicatorVisibility = ({
	isDesktopLayout,
	movementState,
}: ResolvePlayerRunningIndicatorVisibilityInput): boolean =>
	isDesktopLayout && movementState === PLAYER_STATES.MOVEMENT.RUNNING;
