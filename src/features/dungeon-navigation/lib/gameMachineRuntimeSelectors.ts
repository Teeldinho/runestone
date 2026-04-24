import type { DungeonContext } from "@/entities/dungeon";

import type { GameMachineNavigationActionContext } from "./buildGameMachineActionButtons";

type GameMachineSnapshotLike = Readonly<{
	value: unknown;
	context: DungeonContext;
}>;

type GameMachineDoorwayNavigationContext = Pick<
	DungeonContext,
	"currentRoomId" | "enemiesRemaining" | "hasTreasureKey"
>;

type GameMachineAchievementTrackingContext = Pick<
	DungeonContext,
	"discoveredRooms" | "enemiesRemaining" | "hasTreasureKey"
>;

export const selectGameMachineSnapshot = <T extends GameMachineSnapshotLike>(
	snapshot: T,
): T => snapshot;

export const selectActiveStateLabel = (
	snapshot: GameMachineSnapshotLike,
): string => String(snapshot.value);

export const selectCurrentRoomId = (
	snapshot: GameMachineSnapshotLike,
): DungeonContext["currentRoomId"] => snapshot.context.currentRoomId;

export const selectDiscoveredRooms = (
	snapshot: GameMachineSnapshotLike,
): DungeonContext["discoveredRooms"] => snapshot.context.discoveredRooms;

export const selectEnemiesRemaining = (
	snapshot: GameMachineSnapshotLike,
): DungeonContext["enemiesRemaining"] => snapshot.context.enemiesRemaining;

export const selectHasTreasureKey = (
	snapshot: GameMachineSnapshotLike,
): DungeonContext["hasTreasureKey"] => snapshot.context.hasTreasureKey;

export const selectLastDoorwayFeedback = (
	snapshot: GameMachineSnapshotLike,
): DungeonContext["lastDoorwayFeedback"] =>
	snapshot.context.lastDoorwayFeedback;

export const selectLastTransition = (
	snapshot: GameMachineSnapshotLike,
): DungeonContext["lastTransition"] => snapshot.context.lastTransition;

export const selectNearInteractable = (
	snapshot: GameMachineSnapshotLike,
): DungeonContext["nearInteractable"] => snapshot.context.nearInteractable;

export const selectNavigationActionContext = (
	snapshot: GameMachineSnapshotLike,
): GameMachineNavigationActionContext => ({
	currentRoomId: snapshot.context.currentRoomId,
	enemiesRemaining: snapshot.context.enemiesRemaining,
	hasTreasureKey: snapshot.context.hasTreasureKey,
	nearInteractable: snapshot.context.nearInteractable,
});

export const selectDoorwayNavigationContext = (
	snapshot: GameMachineSnapshotLike,
): GameMachineDoorwayNavigationContext => ({
	currentRoomId: snapshot.context.currentRoomId,
	enemiesRemaining: snapshot.context.enemiesRemaining,
	hasTreasureKey: snapshot.context.hasTreasureKey,
});

export const selectInteractionCandidatesContext = (
	snapshot: GameMachineSnapshotLike,
): GameMachineNavigationActionContext => ({
	currentRoomId: snapshot.context.currentRoomId,
	enemiesRemaining: snapshot.context.enemiesRemaining,
	hasTreasureKey: snapshot.context.hasTreasureKey,
	nearInteractable: snapshot.context.nearInteractable,
});

export const selectAchievementTrackingContext = (
	snapshot: GameMachineSnapshotLike,
): GameMachineAchievementTrackingContext => ({
	discoveredRooms: snapshot.context.discoveredRooms,
	enemiesRemaining: snapshot.context.enemiesRemaining,
	hasTreasureKey: snapshot.context.hasTreasureKey,
});
