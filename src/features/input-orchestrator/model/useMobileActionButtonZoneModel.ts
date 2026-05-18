import type {
	MouseEvent as ReactMouseEvent,
	PointerEvent as ReactPointerEvent,
} from "react";
import { useCallback } from "react";

import {
	INPUT_EVENT_TYPES,
	MOBILE_ACTION_BUTTON_COPY,
	MOBILE_ACTION_BUTTON_INPUT_CONFIG,
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
	const handleRunPointerDown = useCallback(
		(event: ReactPointerEvent<HTMLButtonElement>) => {
			event.preventDefault();
			event.stopPropagation();

			sendInput({
				type: INPUT_EVENT_TYPES.RUN_TOGGLED,
			});
		},
		[sendInput],
	);

	const handleJumpPointerDown = useCallback(
		(event: ReactPointerEvent<HTMLButtonElement>) => {
			event.preventDefault();
			event.stopPropagation();

			sendInput({
				type: INPUT_EVENT_TYPES.JUMP_PRESSED,
			});
		},
		[sendInput],
	);

	const handleRunClick = useCallback(
		(event: ReactMouseEvent<HTMLButtonElement>) => {
			if (
				event.detail !==
				MOBILE_ACTION_BUTTON_INPUT_CONFIG.KEYBOARD_ACTIVATION_CLICK_DETAIL
			) {
				return;
			}

			sendInput({
				type: INPUT_EVENT_TYPES.RUN_TOGGLED,
			});
		},
		[sendInput],
	);

	const handleJumpClick = useCallback(
		(event: ReactMouseEvent<HTMLButtonElement>) => {
			if (
				event.detail !==
				MOBILE_ACTION_BUTTON_INPUT_CONFIG.KEYBOARD_ACTIVATION_CLICK_DETAIL
			) {
				return;
			}

			sendInput({
				type: INPUT_EVENT_TYPES.JUMP_PRESSED,
			});
		},
		[sendInput],
	);

	return {
		handleJumpClick,
		handleJumpPointerDown,
		handleRunClick,
		handleRunPointerDown,
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
