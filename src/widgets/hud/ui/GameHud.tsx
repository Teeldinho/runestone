import { HUD_COPY } from "@/widgets/hud/config";
import { useGameHud } from "@/widgets/hud/model";

import { HudActions } from "./HudActions";
import { HudDiscoveredRooms } from "./HudDiscoveredRooms";
import { HudHealthBar } from "./HudHealthBar";
import { HudMachineSnapshot } from "./HudMachineSnapshot";

type GameHudProps = {
	actionButtons: Parameters<typeof useGameHud>[0]["actionButtons"];
	activeStateLabel: Parameters<typeof useGameHud>[0]["activeStateLabel"];
	currentRoomLabel: Parameters<typeof useGameHud>[0]["currentRoomLabel"];
	discoveredRoomLabels: Parameters<
		typeof useGameHud
	>[0]["discoveredRoomLabels"];
	enemiesRemaining: Parameters<typeof useGameHud>[0]["enemiesRemaining"];
	handleDungeonRunReset: Parameters<
		typeof useGameHud
	>[0]["handleDungeonRunReset"];
	hasTreasureKeyLabel: Parameters<typeof useGameHud>[0]["hasTreasureKeyLabel"];
	playerHp: Parameters<typeof useGameHud>[0]["playerHp"];
	playerMaxHp: Parameters<typeof useGameHud>[0]["playerMaxHp"];
};

export function GameHud({ playerHp, playerMaxHp, ...props }: GameHudProps) {
	const gameHudViewModel = useGameHud({
		playerHp,
		playerMaxHp,
		...props,
	});

	const machineSnapshotEntries = gameHudViewModel.machineSnapshotEntries.filter(
		(entry) => entry.label !== HUD_COPY.SNAPSHOT_LABELS.PLAYER_HP,
	);

	return (
		<div className="flex flex-col gap-6">
			<HudHealthBar playerHp={playerHp} playerMaxHp={playerMaxHp} />
			<HudMachineSnapshot entries={machineSnapshotEntries} />
			<HudDiscoveredRooms roomLabels={gameHudViewModel.discoveredRoomLabels} />
			<HudActions
				actionButtons={gameHudViewModel.actionButtons}
				handleDungeonRunReset={gameHudViewModel.handleDungeonRunReset}
			/>
		</div>
	);
}
