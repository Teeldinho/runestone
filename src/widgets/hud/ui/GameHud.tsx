import type {
	GameHudActions,
	GameHudPlayerStats,
	GameHudSnapshot,
} from "@/widgets/hud/model";
import { useGameHud } from "@/widgets/hud/model";
import { GameHudActionsSection } from "./GameHudActionsSection";
import { GameHudDiscoveredRoomsSection } from "./GameHudDiscoveredRoomsSection";
import { GameHudSnapshotSection } from "./GameHudSnapshotSection";
import { GameHudVitalsSection } from "./GameHudVitalsSection";

type GameHudProps = {
	actions: GameHudActions;
	playerStats: GameHudPlayerStats;
	snapshot: GameHudSnapshot;
};

export function GameHud({ actions, playerStats, snapshot }: GameHudProps) {
	const gameHudViewModel = useGameHud({
		actions,
		playerStats,
		snapshot,
	});

	return (
		<div className="flex flex-col gap-3 [&>section]:rounded-xl [&>section]:border [&>section]:border-panel-border/60 [&>section]:bg-background/45 [&>section]:p-3 [&>section]:shadow-sm">
			<GameHudVitalsSection healthBar={gameHudViewModel.healthBar} />
			<GameHudSnapshotSection
				sidebarSnapshotEntries={gameHudViewModel.sidebarSnapshotEntries}
			/>
			<GameHudDiscoveredRoomsSection
				discoveredRoomLabels={gameHudViewModel.discoveredRoomLabels}
			/>
			<GameHudActionsSection
				actionButtons={gameHudViewModel.actionButtons}
				handleDungeonRunReset={gameHudViewModel.handleDungeonRunReset}
			/>
		</div>
	);
}
