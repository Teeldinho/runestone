import { useGameHud } from "@/widgets/hud/model";
import type { HudActionButton } from "@/widgets/hud/model/types";

import { HudActions } from "./HudActions";
import { HudDiscoveredRooms } from "./HudDiscoveredRooms";
import { HudHealthBar } from "./HudHealthBar";
import { HudMachineSnapshot } from "./HudMachineSnapshot";

type GameHudProps = {
	actionButtons: HudActionButton[];
	hudActions: {
		handleDungeonRunReset: () => void;
	};
	hudData: {
		activeStateLabel: string;
		currentRoomLabel: string;
		discoveredRoomLabels: string[];
		enemiesRemaining: number;
		hasTreasureKeyLabel: string;
		playerHp: number;
		playerMaxHp: number;
	};
};

export function GameHud({ actionButtons, hudActions, hudData }: GameHudProps) {
	const gameHudViewModel = useGameHud({
		...hudData,
		actionButtons,
		handleDungeonRunReset: hudActions.handleDungeonRunReset,
	});

	return (
		<div className="flex flex-col gap-6">
			<HudHealthBar
				hpPercentage={gameHudViewModel.hpPercentage}
				isLowHp={gameHudViewModel.isLowHp}
				playerHp={hudData.playerHp}
				playerMaxHp={hudData.playerMaxHp}
			/>
			<HudMachineSnapshot entries={gameHudViewModel.machineSnapshotEntries} />
			<HudDiscoveredRooms roomLabels={gameHudViewModel.discoveredRoomLabels} />
			<HudActions
				actionButtons={gameHudViewModel.actionButtons}
				handleDungeonRunReset={gameHudViewModel.handleDungeonRunReset}
			/>
		</div>
	);
}
