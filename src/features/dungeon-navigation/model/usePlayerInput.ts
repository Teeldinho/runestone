import { useEffect, useRef } from "react";

import {
	PLAYER_EVENTS,
	type PlayerMachineEvent,
	type PlayerMovementKey,
} from "@/entities/player";

import { computeVelocity, isMovementKey } from "../lib/playerInputHelpers";

type UsePlayerInputOptions = {
	sendPlayerEvent: (event: PlayerMachineEvent) => void;
};

export const usePlayerInput = ({
	sendPlayerEvent,
}: UsePlayerInputOptions): void => {
	const pressedKeysRef = useRef<Set<PlayerMovementKey>>(new Set());

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isMovementKey(event.key)) return;
			if (pressedKeysRef.current.has(event.key)) return;

			pressedKeysRef.current.add(event.key);

			sendPlayerEvent({
				type: PLAYER_EVENTS.MOVE,
				velocity: computeVelocity(pressedKeysRef.current),
				isSprinting: event.shiftKey,
			});
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (!isMovementKey(event.key)) return;

			pressedKeysRef.current.delete(event.key);

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
