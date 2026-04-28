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
	const floorLayout = createDungeonFloorLayout(createFloorOneMachine());
	const entrance = floorLayout.rooms.find(
		(room) => room.roomId === ROOM_IDS.ENTRANCE,
	);
	const entrancePosition = entrance
		? [
				entrance.position[0],
				PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
				entrance.position[2],
			]
		: [0, PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET, 0];

	const handleDungeonRunReset = () => {
		const [teleportX, teleportY, teleportZ] = entrancePosition;

		sendPlayerMachineEvent({ type: PLAYER_EVENTS.RESTART });
		setPlayerTeleportTarget(teleportX, teleportY, teleportZ);
		resetDungeonMachine();
	};

	return {
		handleDungeonRunReset,
	};
};

export type { GamePageResetViewModel, UseGamePageResetInput };
