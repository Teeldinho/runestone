import { describe, expect, it } from "vitest";

import type { GamePageViewModel } from "../model/types";
import { buildGamePageViewModelPatch } from "./buildGamePageViewModelPatch";

const makeSlice = <T>(value: T): T => value;

const makeViewModel = (overrides: Partial<GamePageViewModel> = {}): GamePageViewModel => ({
	audio: makeSlice({ handleAudioMuteToggle: () => {}, isAudioMuted: false }),
	canvas: makeSlice({
		cameraStateSnapshot: {} as GamePageViewModel["canvas"]["cameraStateSnapshot"],
		canvasMachineRuntime: {} as GamePageViewModel["canvas"]["canvasMachineRuntime"],
		handleCameraModeSwitch: () => {},
	}),
	hud: makeSlice({
		actionButtons: [],
		activeStateLabel: "idle",
		currentRoomLabel: "Room A",
		discoveredRoomLabels: [],
		enemiesRemaining: 0,
		handleDungeonRunReset: () => {},
		hasTreasureKeyLabel: "No",
		playerHp: 100,
		playerMaxHp: 100,
	}),
	layout: makeSlice({
		isDesktopLayout: true,
		isMobileTabletLandscape: false,
		isTabletLayout: false,
	}),
	mobileSheet: makeSlice({
		handleMobileSheetOpenChange: () => {},
		handleMobileSheetTabChange: () => {},
		isMobileSheetOpen: false,
		mobileSheetTabId: "map" as GamePageViewModel["mobileSheet"]["mobileSheetTabId"],
	}),
	touch: makeSlice({
		handleTouchJoystickMove: () => {},
		handleTouchJoystickStop: () => {},
		handleTouchAttack: () => {},
		handleTouchInteract: () => {},
		hasTouchAttack: false,
		hasTouchInteract: false,
		touchAttackPrompt: null,
		touchInteractPrompt: null,
	}),
	visualizer: makeSlice({ graphSections: [] }),
	...overrides,
});

describe("buildGamePageViewModelPatch", () => {
	it("returns null when prev and next are identical", () => {
		const vm = makeViewModel();
		const result = buildGamePageViewModelPatch(vm, vm);
		expect(result).toBeNull();
	});

	it("returns null when every slice is reference-equal", () => {
		const audio = { handleAudioMuteToggle: () => {}, isAudioMuted: false };
		const vm1 = makeViewModel({ audio });
		const vm2 = makeViewModel({ audio });
		const result = buildGamePageViewModelPatch(vm1, vm2);
		expect(result).toBeNull();
	});

	it("returns a partial with only the changed slice when one slice changes", () => {
		const prev = makeViewModel();
		const newAudio = { handleAudioMuteToggle: () => {}, isAudioMuted: true };
		const next = makeViewModel({ audio: newAudio });

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
		const prev = makeViewModel();
		const newHud = { ...makeViewModel().hud, enemiesRemaining: 3 };
		const newLayout = { isDesktopLayout: false, isMobileTabletLandscape: true, isTabletLayout: false };
		const next = makeViewModel({ hud: newHud, layout: newLayout });

		const result = buildGamePageViewModelPatch(prev, next);

		expect(result).not.toBeNull();
		expect(result).toHaveProperty("hud", newHud);
		expect(result).toHaveProperty("layout", newLayout);
		expect(result).not.toHaveProperty("audio");
	});

	it("uses reference equality (not deep equality) for comparison", () => {
		const prev = makeViewModel();
		const structurallyIdenticalHud = { ...prev.hud };
		const next = makeViewModel({ hud: structurallyIdenticalHud });

		const result = buildGamePageViewModelPatch(prev, next);

		expect(result).not.toBeNull();
		expect(result).toHaveProperty("hud", structurallyIdenticalHud);
	});
});
