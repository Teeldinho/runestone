import type { HUD_DISPLAY_VARIANTS } from "../config";
import type {
	HudHealthViewModel,
	HudMachineSnapshotEntry as HudMachineSnapshotEntryModel,
	HudSnapshotInput,
} from "../lib";

export type HudDisplayVariant =
	(typeof HUD_DISPLAY_VARIANTS)[keyof typeof HUD_DISPLAY_VARIANTS];

export type HudActionButton = {
	eventType: string;
	handleDungeonActionTrigger: () => void;
	isDisabled: boolean;
	label: string;
};

export type HudMachineSnapshotEntry = HudMachineSnapshotEntryModel;

export type GameHudActions = {
	actionButtons: HudActionButton[];
	handleDungeonRunReset: () => void;
};

export type GameHudPlayerStats = {
	playerHp: number;
	playerMaxHp: number;
};

export type GameHudSnapshot = Omit<
	HudSnapshotInput,
	"playerHp" | "playerMaxHp"
> & {
	discoveredRoomLabels: string[];
};

export type GameHudInput = {
	actions: GameHudActions;
	playerStats: GameHudPlayerStats;
	snapshot: GameHudSnapshot;
};

export type GameHudViewModel = {
	actionButtons: HudActionButton[];
	discoveredRoomLabels: string[];
	healthBar: HudHealthViewModel;
	handleDungeonRunReset: () => void;
	machineSnapshotEntries: HudMachineSnapshotEntry[];
	sidebarSnapshotEntries: HudMachineSnapshotEntry[];
};
