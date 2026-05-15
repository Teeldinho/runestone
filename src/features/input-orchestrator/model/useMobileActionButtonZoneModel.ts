import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback } from "react";

import {
	INPUT_EVENT_TYPES,
	MOBILE_ACTION_BUTTON_COPY,
	MOBILE_ACTION_BUTTON_VARIANTS,
} from "../config";
import type { InputOrchestratorEvent } from "./inputOrchestratorMachine";

type UseMobileActionButtonZoneModelInput = {
	readonly isJumpActive: boolean;
	readonly isRunEnabled: boolean;
	readonly sendInput: (event: InputOrchestratorEvent) => void;
};

export const useMobileActionButtonZoneModel = ({
	isJumpActive,
	isRunEnabled,
	sendInput,
}: UseMobileActionButtonZoneModelInput) => {
	const handleButtonPointerDown = useCallback(
		(event: ReactPointerEvent<HTMLButtonElement>) => {
			event.stopPropagation();
		},
		[],
	);

	const handleRunClick = useCallback(() => {
		sendInput({
			type: INPUT_EVENT_TYPES.RUN_TOGGLED,
		});
	}, [sendInput]);

	const handleJumpClick = useCallback(() => {
		sendInput({
			type: INPUT_EVENT_TYPES.JUMP_PRESSED,
		});
	}, [sendInput]);

	return {
		handleButtonPointerDown,
		handleJumpClick,
		handleRunClick,
		jumpButtonPressed: isJumpActive,
		jumpButtonVariant: isJumpActive
			? MOBILE_ACTION_BUTTON_VARIANTS.ACTIVE
			: MOBILE_ACTION_BUTTON_VARIANTS.INACTIVE,
		jumpAriaLabel: MOBILE_ACTION_BUTTON_COPY.JUMP_ARIA_LABEL,
		runButtonPressed: isRunEnabled,
		runButtonVariant: isRunEnabled
			? MOBILE_ACTION_BUTTON_VARIANTS.ACTIVE
			: MOBILE_ACTION_BUTTON_VARIANTS.INACTIVE,
		runAriaLabel: isRunEnabled
			? MOBILE_ACTION_BUTTON_COPY.RUN_ENABLED_ARIA_LABEL
			: MOBILE_ACTION_BUTTON_COPY.RUN_DISABLED_ARIA_LABEL,
	};
};
