import { useCallback, useMemo } from "react";

import { createFloorOneMachine, ROOM_IDS } from "@/entities/dungeon";
import {
	PLAYER_ENTITY_CONFIG,
	PLAYER_EVENTS,
	PLAYER_STATES,
	usePlayerMachineRuntime,
} from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import {
	DUNGEON_MACHINE_SYSTEM_EVENTS,
	useSendDungeonMachineEvent,
} from "@/features/dungeon-navigation";
import { setPlayerTeleportTarget } from "@/shared/lib/playerPositionStore";

type UseGameOverStateResult = {
	isGameOver: boolean;
	handleGameRestart: () => void;
};

export const useGameOverState = (): UseGameOverStateResult => {
	const { snapshot, sendPlayerMachineEvent } = usePlayerMachineRuntime();
	const sendDungeonMachineEvent = useSendDungeonMachineEvent();
	const entrancePosition = useMemo(() => {
		const floorLayout = createDungeonFloorLayout(createFloorOneMachine());
		const entrance = floorLayout.rooms.find(
			(room) => room.roomId === ROOM_IDS.ENTRANCE,
		);

		if (!entrance) {
			return [
				0,
				PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
				0,
			] as const;
		}

		return [
			entrance.position[0],
			PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			entrance.position[2],
		] as const;
	}, []);

	const healthState =
		snapshot.value[PLAYER_STATES.REGIONS.HEALTH as keyof typeof snapshot.value];

	const isGameOver = healthState === PLAYER_STATES.HEALTH.DEAD;

	const handleGameRestart = useCallback(() => {
		setPlayerTeleportTarget(
			entrancePosition[0],
			entrancePosition[1],
			entrancePosition[2],
		);
		sendPlayerMachineEvent({ type: PLAYER_EVENTS.RESTART });
		sendDungeonMachineEvent({
			type: DUNGEON_MACHINE_SYSTEM_EVENTS.RESET_DUNGEON_RUN,
		});
	}, [entrancePosition, sendPlayerMachineEvent, sendDungeonMachineEvent]);

	return { isGameOver, handleGameRestart };
};
