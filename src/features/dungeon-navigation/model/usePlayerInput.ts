import { useEffect, useRef } from "react";

import {
	PLAYER_EVENTS,
	type PlayerMachineEvent,
	type PlayerMovementKey,
} from "@/entities/player";

import { computeVelocity, getMovementKey } from "../lib/playerInputHelpers";

type UsePlayerInputOptions = {
	sendPlayerEvent: (event: PlayerMachineEvent) => void;
};

export const usePlayerInput = ({
	sendPlayerEvent,
}: UsePlayerInputOptions): void => {
	const pressedKeysRef = useRef<Set<PlayerMovementKey>>(new Set());

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const movementKey = getMovementKey(event.key);
			if (!movementKey) return;
			if (pressedKeysRef.current.has(movementKey)) return;

			pressedKeysRef.current.add(movementKey);

			sendPlayerEvent({
				type: PLAYER_EVENTS.MOVE,
				velocity: computeVelocity(pressedKeysRef.current),
				isSprinting: event.shiftKey,
			});
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			const movementKey = getMovementKey(event.key);
			if (!movementKey) return;

			pressedKeysRef.current.delete(movementKey);

			if (pressedKeysRef.current.size === 0) {
				sendPlayerEvent({ type: PLAYER_EVENTS.STOP });
			} else {
				sendPlayerEvent({
					type: PLAYER_EVENTS.MOVE,
					velocity: computeVelocity(pressedKeysRef.current),
					isSprinting: event.shiftKey,
				});
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [sendPlayerEvent]);
};
