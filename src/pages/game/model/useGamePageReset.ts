import { useCallback, useMemo } from "react";

import { createFloorOneMachine, ROOM_IDS } from "@/entities/dungeon";
import {
	PLAYER_ENTITY_CONFIG,
	PLAYER_EVENTS,
	type PlayerMachineEvent,
} from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import { setPlayerTeleportTarget } from "@/shared/lib";

type UseGamePageResetInput = {
	resetDungeonMachine: () => void;
	sendPlayerMachineEvent: (event: PlayerMachineEvent) => void;
};

type GamePageResetViewModel = {
	handleDungeonRunReset: () => void;
};

export const useGamePageReset = ({
	resetDungeonMachine,
	sendPlayerMachineEvent,
}: UseGamePageResetInput): GamePageResetViewModel => {
	const entrancePosition = useMemo(() => {
		const floorLayout = createDungeonFloorLayout(createFloorOneMachine());
		const entrance = floorLayout.rooms.find(
			(room) => room.roomId === ROOM_IDS.ENTRANCE,
		);

		if (entrance) {
			const [entranceX, , entranceZ] = entrance.position;

			return [
				entranceX,
				PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
				entranceZ,
			] as const;
		}

		return [0, PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET, 0] as const;
	}, []);

	const handleDungeonRunReset = useCallback(() => {
		const [teleportX, teleportY, teleportZ] = entrancePosition;

		sendPlayerMachineEvent({ type: PLAYER_EVENTS.RESTART });
		setPlayerTeleportTarget(teleportX, teleportY, teleportZ);
		resetDungeonMachine();
	}, [entrancePosition, resetDungeonMachine, sendPlayerMachineEvent]);

	return {
		handleDungeonRunReset,
	};
};

export type { GamePageResetViewModel, UseGamePageResetInput };
