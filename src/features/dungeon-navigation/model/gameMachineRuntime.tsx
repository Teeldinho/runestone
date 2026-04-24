import { createActorContext } from "@xstate/react";
import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";

import type { GameMachineEvent } from "@/features/dungeon-navigation/config";

import {
	selectGameMachineSnapshot,
} from "../lib";
import { createGameMachine } from "./gameMachine";

type DungeonMachineSnapshot = ReturnType<
	ReturnType<typeof createGameMachine>["getInitialSnapshot"]
>;

type GameMachineSelector<T> = (snapshot: DungeonMachineSnapshot) => T;

type GameMachineRuntimeContextValue = {
	sendDungeonMachineEvent: (event: GameMachineEvent) => void;
	snapshot: DungeonMachineSnapshot;
};

type DungeonGameMachineProviderProps = {
	children: ReactNode;
};

const dungeonGameMachineContext = createActorContext(createGameMachine());

export const DungeonGameMachineProvider = ({
	children,
}: DungeonGameMachineProviderProps) => {
	return (
		<dungeonGameMachineContext.Provider>
			{children}
		</dungeonGameMachineContext.Provider>
	);
};

export const useGameMachineSelector = <T,>(
	selector: GameMachineSelector<T>,
	compare?: (previous: T, next: T) => boolean,
): T => dungeonGameMachineContext.useSelector(selector, compare);

export const useGameMachineActorRef = () => {
	return dungeonGameMachineContext.useActorRef();
};

export const useSendDungeonMachineEvent = () => {
	const actorRef = useGameMachineActorRef();

	return useCallback(
		(event: GameMachineEvent) => {
			actorRef.send(event);
		},
		[actorRef],
	);
};

export const useGameMachineRuntime = (): GameMachineRuntimeContextValue => {
	const snapshot = useGameMachineSelector(selectGameMachineSnapshot);
	const sendDungeonMachineEvent = useSendDungeonMachineEvent();

	return useMemo(
		() => ({
			sendDungeonMachineEvent,
			snapshot,
		}),
		[sendDungeonMachineEvent, snapshot],
	);
};

export {
	selectAchievementTrackingContext,
	selectActiveStateLabel,
	selectCurrentRoomId,
	selectDiscoveredRooms,
	selectDoorwayNavigationContext,
	selectEnemiesRemaining,
	selectGameMachineSnapshot,
	selectHasTreasureKey,
	selectInteractionCandidatesContext,
	selectLastDoorwayFeedback,
	selectLastTransition,
	selectNavigationActionContext,
	selectNearInteractable,
} from "../lib";
