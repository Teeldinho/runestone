import { INPUT_MOVEMENT_CONFIG } from "../config";
import type { InputVector2 } from "../model/inputOrchestratorMachine";

type HasActiveInputMovementInput = {
	readonly vector: InputVector2;
};

export const hasActiveInputMovement = ({
	vector,
}: HasActiveInputMovementInput): boolean =>
	Math.hypot(vector.x, vector.y) > INPUT_MOVEMENT_CONFIG.MOVEMENT_EPSILON;
