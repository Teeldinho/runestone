import { useEffect, useRef } from "react";

import type { PlayerMovementKey } from "@/entities/player";

import { INPUT_EVENT_TYPES, INPUT_KEYBOARD_EVENT_NAMES } from "../config";
import {
	getKeyboardMovementKey,
	resolveKeyboardMovementVelocity,
	resolveMovementVelocityMagnitude,
	resolveRunIntent,
} from "../lib";
import type { InputOrchestratorEvent } from "./inputOrchestratorMachine";

type UseKeyboardMovementInputInput = {
	readonly sendInput: (event: InputOrchestratorEvent) => void;
	readonly isRunToggled: boolean;
};

const VELOCITY_X_INDEX = 0;
const VELOCITY_Z_INDEX = 2;

export const useKeyboardMovementInput = ({
	sendInput,
	isRunToggled,
}: UseKeyboardMovementInputInput): void => {
	const pressedKeysRef = useRef<Set<PlayerMovementKey>>(new Set());

	useEffect(() => {
		const sendMoveChanged = () => {
			const velocity = resolveKeyboardMovementVelocity({
				pressedKeys: pressedKeysRef.current,
			});

			sendInput({
				type: INPUT_EVENT_TYPES.MOVE_CHANGED,
				vector: {
					x: velocity[VELOCITY_X_INDEX],
					y: velocity[VELOCITY_Z_INDEX],
				},
				magnitude: resolveMovementVelocityMagnitude({ velocity }),
				wantsRun: resolveRunIntent({ isRunToggled }),
			});
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.repeat) {
				return;
			}

			const movementKey = getKeyboardMovementKey(event.key);

			if (!movementKey) {
				return;
			}

			if (pressedKeysRef.current.has(movementKey)) {
				return;
			}

			event.preventDefault();
			pressedKeysRef.current.add(movementKey);
			sendMoveChanged();
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			const movementKey = getKeyboardMovementKey(event.key);

			if (!movementKey) {
				return;
			}

			event.preventDefault();
			pressedKeysRef.current.delete(movementKey);

			if (pressedKeysRef.current.size === 0) {
				sendInput({
					type: INPUT_EVENT_TYPES.MOVE_STOPPED,
				});
				return;
			}

			sendMoveChanged();
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
	}, [isRunToggled, sendInput]);
};

export type { UseKeyboardMovementInputInput };
