import { useCallback } from "react";
import type { Vector3Tuple } from "@/shared/lib";

import { INPUT_EVENT_TYPES } from "../config";
import { resolveMovementVelocityMagnitude, resolveRunIntent } from "../lib";
import type { InputOrchestratorEvent } from "./inputOrchestratorMachine";

type UseTouchMovementInputInput = {
	readonly sendInput: (event: InputOrchestratorEvent) => void;
	readonly isRunToggled: boolean;
};

const VECTOR_X_INDEX = 0;
const VECTOR_Z_INDEX = 2;

export const useTouchMovementInput = ({
	sendInput,
	isRunToggled,
}: UseTouchMovementInputInput) => {
	const handleMoveVelocity = useCallback(
		(velocity: Vector3Tuple) => {
			const magnitude = resolveMovementVelocityMagnitude({ velocity });

			sendInput({
				type: INPUT_EVENT_TYPES.MOVE_CHANGED,
				vector: {
					x: velocity[VECTOR_X_INDEX],
					y: velocity[VECTOR_Z_INDEX],
				},
				magnitude,
				wantsRun: resolveRunIntent({ isRunToggled }),
			});
		},
		[isRunToggled, sendInput],
	);

	const handleStopVelocity = useCallback(() => {
		sendInput({
			type: INPUT_EVENT_TYPES.MOVE_STOPPED,
		});
	}, [sendInput]);

	return {
		handleMoveVelocity,
		handleStopVelocity,
	};
};
