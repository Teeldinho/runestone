import { useEffect } from "react";

import { INPUT_EVENT_TYPES, INPUT_KEYBOARD_EVENT_NAMES } from "../config";
import { resolveKeyboardInputEvent } from "../lib";
import type { InputOrchestratorEvent } from "./inputOrchestratorMachine";

type UseKeyboardInputOrchestratorInput = {
	readonly sendInput: (event: InputOrchestratorEvent) => void;
};

export const useKeyboardInputOrchestrator = ({
	sendInput,
}: UseKeyboardInputOrchestratorInput) => {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.repeat) {
				return;
			}

			const resolvedEvent = resolveKeyboardInputEvent({
				code: event.code,
				phase: INPUT_EVENT_TYPES.KEY_DOWN,
			});

			if (!resolvedEvent) {
				return;
			}

			event.preventDefault();
			sendInput(resolvedEvent);
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			const resolvedEvent = resolveKeyboardInputEvent({
				code: event.code,
				phase: INPUT_EVENT_TYPES.KEY_UP,
			});

			if (!resolvedEvent) {
				return;
			}

			event.preventDefault();
			sendInput(resolvedEvent);
		};

		window.addEventListener(INPUT_KEYBOARD_EVENT_NAMES.KEY_DOWN, handleKeyDown);
		window.addEventListener(INPUT_KEYBOARD_EVENT_NAMES.KEY_UP, handleKeyUp);

		return () => {
			window.removeEventListener(
				INPUT_KEYBOARD_EVENT_NAMES.KEY_DOWN,
				handleKeyDown,
			);
			window.removeEventListener(
				INPUT_KEYBOARD_EVENT_NAMES.KEY_UP,
				handleKeyUp,
			);
		};
	}, [sendInput]);
};
