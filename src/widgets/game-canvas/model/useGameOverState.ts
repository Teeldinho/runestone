import { useCallback } from "react";

import {
	PLAYER_EVENTS,
	PLAYER_STATES,
	usePlayerMachineRuntime,
} from "@/entities/player";
import {
	DUNGEON_MACHINE_SYSTEM_EVENTS,
	useSendDungeonMachineEvent,
} from "@/features/dungeon-navigation";

type UseGameOverStateResult = {
	isGameOver: boolean;
	handleGameRestart: () => void;
};

export const useGameOverState = (): UseGameOverStateResult => {
	const { snapshot, sendPlayerMachineEvent } = usePlayerMachineRuntime();
	const sendDungeonMachineEvent = useSendDungeonMachineEvent();

	const healthState =
		snapshot.value[PLAYER_STATES.REGIONS.HEALTH as keyof typeof snapshot.value];

	const isGameOver = healthState === PLAYER_STATES.HEALTH.DEAD;

	const handleGameRestart = useCallback(() => {
		sendPlayerMachineEvent({ type: PLAYER_EVENTS.RESTART });
		sendDungeonMachineEvent({
			type: DUNGEON_MACHINE_SYSTEM_EVENTS.RESET_DUNGEON_RUN,
		});
	}, [sendPlayerMachineEvent, sendDungeonMachineEvent]);

	return { isGameOver, handleGameRestart };
};
