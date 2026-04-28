import { describe, expect, it } from "vitest";

import type { GamePageViewModel } from "../model/types";
import { buildGamePageViewModelPatch } from "./buildGamePageViewModelPatch";

const STABLE_AUDIO = { handleAudioMuteToggle: () => {}, isAudioMuted: false };
const STABLE_CANVAS = {
	cameraStateSnapshot: {} as GamePageViewModel["canvas"]["cameraStateSnapshot"],
	canvasMachineRuntime:
		{} as GamePageViewModel["canvas"]["canvasMachineRuntime"],
	handleCameraModeSwitch: () => {},
};
const STABLE_HUD = {
	actionButtons: [] as GamePageViewModel["hud"]["actionButtons"],
	currentRoomLabel: "Room A",
	discoveredRoomLabels: [] as string[],
	enemiesRemaining: 0,
	handleDungeonRunReset: () => {},
	hasTreasureKeyLabel: "No",
	nearInteractableLabel: "—",
	playerHp: 100,
	playerMaxHp: 100,
};
const STABLE_LAYOUT = {
	isDesktopLayout: true,
	isMobileTabletLandscape: false,
	isTabletLayout: false,
};
const STABLE_MOBILE_SHEET = {
	handleMobileSheetOpenChange: () => {},
	handleMobileSheetTabChange: () => {},
	isMobileSheetOpen: false,
	mobileSheetTabId:
		"map" as GamePageViewModel["mobileSheet"]["mobileSheetTabId"],
};
const STABLE_TOUCH = {
	handleTouchJoystickMove: () => {},
	handleTouchJoystickStop: () => {},
	handleTouchAttack: () => {},
	handleTouchInteract: () => {},
	hasTouchAttack: false,
	hasTouchInteract: false,
	touchAttackPrompt: null,
	touchInteractPrompt: null,
};
const STABLE_VISUALIZER = {
	graphSections: [] as GamePageViewModel["visualizer"]["graphSections"],
};

const BASE_VIEW_MODEL: GamePageViewModel = {
	audio: STABLE_AUDIO,
	canvas: STABLE_CANVAS,
	hud: STABLE_HUD,
	layout: STABLE_LAYOUT,
	mobileSheet: STABLE_MOBILE_SHEET,
	touch: STABLE_TOUCH,
	visualizer: STABLE_VISUALIZER,
};

describe("buildGamePageViewModelPatch", () => {
	it("returns null when prev and next are the same object", () => {
		const result = buildGamePageViewModelPatch(
			BASE_VIEW_MODEL,
			BASE_VIEW_MODEL,
		);
		expect(result).toBeNull();
	});

	it("returns null when every slice is reference-equal across separate objects", () => {
		const vm1: GamePageViewModel = { ...BASE_VIEW_MODEL };
		const vm2: GamePageViewModel = { ...BASE_VIEW_MODEL };
		const result = buildGamePageViewModelPatch(vm1, vm2);
		expect(result).toBeNull();
	});

	it("returns a partial with only the changed slice when one slice changes", () => {
		const newAudio = { handleAudioMuteToggle: () => {}, isAudioMuted: true };
		const prev: GamePageViewModel = { ...BASE_VIEW_MODEL };
		const next: GamePageViewModel = { ...BASE_VIEW_MODEL, audio: newAudio };

		const result = buildGamePageViewModelPatch(prev, next);

		expect(result).not.toBeNull();
		expect(result).toHaveProperty("audio", newAudio);
		expect(result).not.toHaveProperty("hud");
		expect(result).not.toHaveProperty("canvas");
		expect(result).not.toHaveProperty("layout");
		expect(result).not.toHaveProperty("mobileSheet");
		expect(result).not.toHaveProperty("touch");
		expect(result).not.toHaveProperty("visualizer");
	});

	it("returns a partial with multiple changed slices when several change", () => {
		const newHud = { ...STABLE_HUD, enemiesRemaining: 3 };
		const newLayout = {
			isDesktopLayout: false,
			isMobileTabletLandscape: true,
			isTabletLayout: false,
		};
		const prev: GamePageViewModel = { ...BASE_VIEW_MODEL };
		const next: GamePageViewModel = {
			...BASE_VIEW_MODEL,
			hud: newHud,
			layout: newLayout,
		};

		const result = buildGamePageViewModelPatch(prev, next);

		expect(result).not.toBeNull();
		expect(result).toHaveProperty("hud", newHud);
		expect(result).toHaveProperty("layout", newLayout);
		expect(result).not.toHaveProperty("audio");
		expect(result).not.toHaveProperty("canvas");
	});

	it("uses reference equality rather than deep equality for comparison", () => {
		const structurallyIdenticalHud = { ...STABLE_HUD };
		const prev: GamePageViewModel = { ...BASE_VIEW_MODEL };
		const next: GamePageViewModel = {
			...BASE_VIEW_MODEL,
			hud: structurallyIdenticalHud,
		};

		const result = buildGamePageViewModelPatch(prev, next);

		expect(result).not.toBeNull();
		expect(result).toHaveProperty("hud", structurallyIdenticalHud);
		expect(result).not.toHaveProperty("audio");
	});
});
