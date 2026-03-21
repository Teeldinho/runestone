import { useGameMachine } from "@/features/dungeon-navigation";
import { useStateVisualizer } from "@/features/state-visualizer";

type GamePageViewModel = {
	actionButtons: ReturnType<typeof useGameMachine>["actionButtons"];
	activeStateLabel: string;
	currentRoomLabel: string;
	discoveredRoomLabels: string[];
	enemiesRemaining: number;
	graphEdges: ReturnType<typeof useStateVisualizer>["edges"];
	graphNodes: ReturnType<typeof useStateVisualizer>["positionedNodes"];
	hasTreasureKeyLabel: string;
	resetDungeonRun: () => void;
};

export const useGamePage = (): GamePageViewModel => {
	const {
		actionButtons,
		currentRoomLabel,
		discoveredRoomLabels,
		resetDungeonRun,
		snapshot,
	} = useGameMachine();

	const { edges, positionedNodes } = useStateVisualizer({
		context: snapshot.context,
	});

	return {
		actionButtons,
		activeStateLabel: String(snapshot.value),
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining: snapshot.context.enemiesRemaining,
		graphEdges: edges,
		graphNodes: positionedNodes,
		hasTreasureKeyLabel: snapshot.context.hasTreasureKey
			? "Acquired"
			: "Missing",
		resetDungeonRun,
	};
};

export type { GamePageViewModel };
