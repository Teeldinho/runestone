import { useEffect } from "react";

import { INPUT_EVENT_TYPES } from "../config";
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

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [sendInput]);
};
