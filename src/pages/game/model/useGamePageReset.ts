import { useCallback, useMemo } from "react";

import { createFloorOneMachine, ROOM_IDS } from "@/entities/dungeon";
import {
	PLAYER_ENTITY_CONFIG,
	PLAYER_EVENTS,
	usePlayerMachineRuntime,
} from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import { useGameMachine } from "@/features/dungeon-navigation";
import { setPlayerTeleportTarget } from "@/shared/lib";

export const useGamePageReset = () => {
	const { sendPlayerMachineEvent } = usePlayerMachineRuntime();
	const { handleDungeonRunReset: resetDungeonMachine } = useGameMachine();

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
	}, [sendPlayerMachineEvent, resetDungeonMachine, entrancePosition]);

	return { entrancePosition, handleDungeonRunReset };
};
