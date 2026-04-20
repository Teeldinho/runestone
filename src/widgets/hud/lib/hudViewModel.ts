import {
	HUD_COPY,
	HUD_DISPLAY_VARIANTS,
	HUD_EVENT_FILTERS,
	HUD_HEALTH,
	HUD_HEALTH_FILL_CLASSES,
	HUD_MACHINE_SNAPSHOT,
} from "../config";

export type HudActionButtonInput = {
	eventType: string;
	handleDungeonActionTrigger: () => void;
	isDisabled: boolean;
	label: string;
};

export type HudSnapshotInput = {
	currentRoomLabel: string;
	enemiesRemaining: number;
	hasTreasureKeyLabel: string;
	nearInteractableLabel: string;
	playerHp: number;
	playerMaxHp: number;
};

export type HudMachineSnapshotEntry = {
	displayVariant: (typeof HUD_DISPLAY_VARIANTS)[keyof typeof HUD_DISPLAY_VARIANTS];
	label: string;
	value: string;
};

export type HudHealthInput = {
	playerHp: number;
	playerMaxHp: number;
};

export type HudHealthViewModel = {
	fillClassName: string;
	hpPercentage: number;
	isLowHp: boolean;
	label: string;
};

const clampHealthPercentage = (value: number) =>
	Math.max(HUD_HEALTH.PERCENT_MIN, Math.min(HUD_HEALTH.PERCENT_MAX, value));

const getSafeHealthPercentage = ({ playerHp, playerMaxHp }: HudHealthInput) => {
	if (playerMaxHp <= 0) {
		return HUD_HEALTH.PERCENT_MIN;
	}

	return clampHealthPercentage(
		(playerHp / playerMaxHp) * HUD_HEALTH.PERCENT_MAX,
	);
};

export const filterHudActionButtons = (actionButtons: HudActionButtonInput[]) =>
	actionButtons.filter(
		(actionButton) =>
			!HUD_EVENT_FILTERS.SIDEBAR_EXCLUDED_EVENT_TYPES.includes(
				actionButton.eventType,
			),
	);

export const buildHudMachineSnapshotEntries = ({
	currentRoomLabel,
	enemiesRemaining,
	hasTreasureKeyLabel,
	nearInteractableLabel,
	playerHp,
	playerMaxHp,
}: HudSnapshotInput): HudMachineSnapshotEntry[] => [
	{
		displayVariant: HUD_DISPLAY_VARIANTS.TEXT,
		label: HUD_COPY.SNAPSHOT_LABELS.CURRENT_ROOM,
		value: currentRoomLabel,
	},
	{
		displayVariant: HUD_DISPLAY_VARIANTS.TEXT,
		label: HUD_COPY.SNAPSHOT_LABELS.NEAR_INTERACTABLE,
		value: nearInteractableLabel,
	},
	{
		displayVariant: HUD_DISPLAY_VARIANTS.BADGE,
		label: HUD_COPY.SNAPSHOT_LABELS.TREASURE_KEY,
		value: hasTreasureKeyLabel,
	},
	{
		displayVariant: HUD_DISPLAY_VARIANTS.TEXT,
		label: HUD_COPY.SNAPSHOT_LABELS.ENEMIES_REMAINING,
		value: String(enemiesRemaining),
	},
	{
		displayVariant: HUD_DISPLAY_VARIANTS.TEXT,
		label: HUD_COPY.SNAPSHOT_LABELS.PLAYER_HP,
		value: `${playerHp} / ${playerMaxHp}`,
	},
];

export const getSidebarSnapshotEntries = (
	machineSnapshotEntries: HudMachineSnapshotEntry[],
) =>
	machineSnapshotEntries.filter(
		(snapshotEntry) =>
			!HUD_MACHINE_SNAPSHOT.SIDEBAR_EXCLUDED_LABELS.includes(
				snapshotEntry.label,
			),
	);

export const buildHudHealthViewModel = ({
	playerHp,
	playerMaxHp,
}: HudHealthInput): HudHealthViewModel => {
	const hpPercentage = getSafeHealthPercentage({ playerHp, playerMaxHp });
	const isLowHp = hpPercentage < HUD_HEALTH.LOW_HP_THRESHOLD_PERCENT;

	return {
		fillClassName: isLowHp
			? HUD_HEALTH_FILL_CLASSES.LOW
			: HUD_HEALTH_FILL_CLASSES.DEFAULT,
		hpPercentage,
		isLowHp,
		label: `${playerHp} / ${playerMaxHp}`,
	};
};
