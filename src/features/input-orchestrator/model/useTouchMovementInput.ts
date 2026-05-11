import { useCallback } from "react";
import type { Vector3Tuple } from "@/shared/lib";

import { INPUT_EVENT_TYPES } from "../config";
import {
	resolveMobileRunIntent,
	resolveRunIntent,
	resolveTouchVelocityMagnitude,
} from "../lib";
import type { InputOrchestratorEvent } from "./inputOrchestratorMachine";

type UseTouchMovementInputInput = {
	readonly sendInput: (event: InputOrchestratorEvent) => void;
	readonly isDesktopRunHeld: boolean;
	readonly isMobileRunToggled: boolean;
};

const VECTOR_X_INDEX = 0;
const VECTOR_Z_INDEX = 2;

export const useTouchMovementInput = ({
	sendInput,
	isDesktopRunHeld,
	isMobileRunToggled,
}: UseTouchMovementInputInput) => {
	const handleMoveVelocity = useCallback(
		(velocity: Vector3Tuple) => {
			const magnitude = resolveTouchVelocityMagnitude({ velocity });
			const isMobileMagnitudeRun = resolveMobileRunIntent({ magnitude });
			const wantsRun = resolveRunIntent({
				isDesktopRunHeld,
				isMobileRunToggled,
				isMobileMagnitudeRun,
			});

			sendInput({
				type: INPUT_EVENT_TYPES.MOVE_CHANGED,
				vector: {
					x: velocity[VECTOR_X_INDEX],
					y: velocity[VECTOR_Z_INDEX],
				},
				magnitude,
				wantsRun,
			});
		},
		[isDesktopRunHeld, isMobileRunToggled, sendInput],
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
