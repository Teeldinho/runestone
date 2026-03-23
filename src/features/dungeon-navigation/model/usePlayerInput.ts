import { useEffect, useRef } from "react";

import {
	PLAYER_EVENTS,
	PLAYER_MOVEMENT_DIRECTIONS,
	PLAYER_MOVEMENT_KEYS,
	type PlayerMachineEvent,
	type PlayerMovementKey,
} from "@/entities/player";
import type { Vector3Tuple } from "@/shared/types";

type UsePlayerInputOptions = {
	sendPlayerEvent: (event: PlayerMachineEvent) => void;
};

const isMovementKey = (key: string): key is PlayerMovementKey =>
	Object.values(PLAYER_MOVEMENT_KEYS).includes(key as PlayerMovementKey);

const computeVelocity = (pressedKeys: Set<PlayerMovementKey>): Vector3Tuple => {
	let x = 0;
	let z = 0;

	for (const key of pressedKeys) {
		const direction = PLAYER_MOVEMENT_DIRECTIONS[key];
		x += direction[0];
		z += direction[2];
	}

	return [x, 0, z];
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
