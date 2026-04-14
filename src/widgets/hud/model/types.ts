import type { HUD_DISPLAY_VARIANTS } from "../config";

export type HudDisplayVariant =
	(typeof HUD_DISPLAY_VARIANTS)[keyof typeof HUD_DISPLAY_VARIANTS];

export type HudActionButton = {
	eventType: string;
	handleDungeonActionTrigger: () => void;
	isDisabled: boolean;
	label: string;
};

export type HudMachineSnapshotEntry = {
	displayVariant: HudDisplayVariant;
	label: string;
	value: string;
};

export type GameHudViewModel = {
	actionButtons: HudActionButton[];
	discoveredRoomLabels: string[];
	handleDungeonRunReset: () => void;
	hpPercentage: number;
	isLowHp: boolean;
	machineSnapshotEntries: HudMachineSnapshotEntry[];
};
