import { createActorContext } from "@xstate/react";
import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";

import type { GameMachineEvent } from "@/features/dungeon-navigation/config";

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

export const selectGameMachineSnapshot: GameMachineSelector<
	DungeonMachineSnapshot
> = (snapshot) => snapshot;

export const selectActiveStateLabel: GameMachineSelector<string> = (snapshot) =>
	String(snapshot.value);

export const selectCurrentRoomId: GameMachineSelector<
	DungeonMachineSnapshot["context"]["currentRoomId"]
> = (snapshot) => snapshot.context.currentRoomId;

export const selectDiscoveredRooms: GameMachineSelector<
	DungeonMachineSnapshot["context"]["discoveredRooms"]
> = (snapshot) => snapshot.context.discoveredRooms;

export const selectEnemiesRemaining: GameMachineSelector<
	DungeonMachineSnapshot["context"]["enemiesRemaining"]
> = (snapshot) => snapshot.context.enemiesRemaining;

export const selectHasTreasureKey: GameMachineSelector<
	DungeonMachineSnapshot["context"]["hasTreasureKey"]
> = (snapshot) => snapshot.context.hasTreasureKey;

export const selectLastDoorwayFeedback: GameMachineSelector<
	DungeonMachineSnapshot["context"]["lastDoorwayFeedback"]
> = (snapshot) => snapshot.context.lastDoorwayFeedback;

export const selectLastTransition: GameMachineSelector<
	DungeonMachineSnapshot["context"]["lastTransition"]
> = (snapshot) => snapshot.context.lastTransition;

export const selectNearInteractable: GameMachineSelector<
	DungeonMachineSnapshot["context"]["nearInteractable"]
> = (snapshot) => snapshot.context.nearInteractable;

export const selectNavigationActionContext: GameMachineSelector<{
	currentRoomId: DungeonMachineSnapshot["context"]["currentRoomId"];
	enemiesRemaining: DungeonMachineSnapshot["context"]["enemiesRemaining"];
	hasTreasureKey: DungeonMachineSnapshot["context"]["hasTreasureKey"];
	nearInteractable: DungeonMachineSnapshot["context"]["nearInteractable"];
}> = (snapshot) => ({
	currentRoomId: snapshot.context.currentRoomId,
	enemiesRemaining: snapshot.context.enemiesRemaining,
	hasTreasureKey: snapshot.context.hasTreasureKey,
	nearInteractable: snapshot.context.nearInteractable,
});

export const selectDoorwayNavigationContext: GameMachineSelector<{
	currentRoomId: DungeonMachineSnapshot["context"]["currentRoomId"];
	enemiesRemaining: DungeonMachineSnapshot["context"]["enemiesRemaining"];
	hasTreasureKey: DungeonMachineSnapshot["context"]["hasTreasureKey"];
}> = (snapshot) => ({
	currentRoomId: snapshot.context.currentRoomId,
	enemiesRemaining: snapshot.context.enemiesRemaining,
	hasTreasureKey: snapshot.context.hasTreasureKey,
});

export const selectInteractionCandidatesContext: GameMachineSelector<{
	currentRoomId: DungeonMachineSnapshot["context"]["currentRoomId"];
	enemiesRemaining: DungeonMachineSnapshot["context"]["enemiesRemaining"];
	hasTreasureKey: DungeonMachineSnapshot["context"]["hasTreasureKey"];
	nearInteractable: DungeonMachineSnapshot["context"]["nearInteractable"];
}> = (snapshot) => ({
	currentRoomId: snapshot.context.currentRoomId,
	enemiesRemaining: snapshot.context.enemiesRemaining,
	hasTreasureKey: snapshot.context.hasTreasureKey,
	nearInteractable: snapshot.context.nearInteractable,
});

export const selectAchievementTrackingContext: GameMachineSelector<{
	discoveredRooms: DungeonMachineSnapshot["context"]["discoveredRooms"];
	enemiesRemaining: DungeonMachineSnapshot["context"]["enemiesRemaining"];
	hasTreasureKey: DungeonMachineSnapshot["context"]["hasTreasureKey"];
}> = (snapshot) => ({
	discoveredRooms: snapshot.context.discoveredRooms,
	enemiesRemaining: snapshot.context.enemiesRemaining,
	hasTreasureKey: snapshot.context.hasTreasureKey,
});

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
