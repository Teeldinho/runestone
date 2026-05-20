import type {
	MouseEvent as ReactMouseEvent,
	PointerEvent as ReactPointerEvent,
} from "react";
import { useCallback, useState } from "react";

import {
	INPUT_EVENT_TYPES,
	MOBILE_ACTION_BUTTON_COPY,
	MOBILE_ACTION_BUTTON_INPUT_CONFIG,
} from "../config";
import { resolveMobileActionButtonZoneViewState } from "../lib";
import type { InputOrchestratorEvent } from "./inputOrchestratorMachine";

type UseMobileActionButtonZoneModelInput = {
	readonly isRunEnabled: boolean;
	readonly sendInput: (event: InputOrchestratorEvent) => void;
};

export const useMobileActionButtonZoneModel = ({
	isRunEnabled,
	sendInput,
}: UseMobileActionButtonZoneModelInput) => {
	const [isJumpPressed, setIsJumpPressed] = useState(false);

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

			if (typeof event.currentTarget.setPointerCapture === "function") {
				event.currentTarget.setPointerCapture(event.pointerId);
			}

			setIsJumpPressed(true);

			sendInput({
				type: INPUT_EVENT_TYPES.JUMP_PRESSED,
			});
		},
		[sendInput],
	);

	const handleJumpPointerUp = useCallback(() => {
		setIsJumpPressed(false);
	}, []);

	const handleJumpPointerCancel = useCallback(() => {
		setIsJumpPressed(false);
	}, []);

	const handleJumpLostPointerCapture = useCallback(() => {
		setIsJumpPressed(false);
	}, []);

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

	const viewState = resolveMobileActionButtonZoneViewState({
		isJumpPressed,
		isRunEnabled,
	});

	return {
		handleJumpClick,
		handleJumpPointerDown,
		handleJumpLostPointerCapture,
		handleJumpPointerCancel,
		handleJumpPointerUp,
		handleRunClick,
		handleRunPointerDown,
		jumpButtonPressed: viewState.jumpButtonPressed,
		jumpButtonVariant: viewState.jumpButtonVariant,
		jumpAriaLabel: MOBILE_ACTION_BUTTON_COPY.JUMP_ARIA_LABEL,
		runButtonPressed: viewState.runButtonPressed,
		runButtonVariant: viewState.runButtonVariant,
		runAriaLabel: isRunEnabled
			? MOBILE_ACTION_BUTTON_COPY.RUN_ENABLED_ARIA_LABEL
			: MOBILE_ACTION_BUTTON_COPY.RUN_DISABLED_ARIA_LABEL,
	};
};
