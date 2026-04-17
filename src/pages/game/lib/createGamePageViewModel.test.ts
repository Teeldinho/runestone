import { describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/features/camera-system";
import { ROOM_IDS } from "@/entities/dungeon";

import { createGamePageViewModel } from "./createGamePageViewModel";

describe("createGamePageViewModel", () => {
	it("maps machine and layout slices into the page view model", () => {
		const handleAudioMuteToggle = vi.fn();
		const handleCameraModeSwitch = vi.fn();
		const handleDungeonRunReset = vi.fn();
		const handleMobileSheetOpenChange = vi.fn();
		const handleMobileSheetTabChange = vi.fn();
		const handleTouchAttack = vi.fn();
		const handleTouchInteract = vi.fn();
		const handleTouchJoystickMove = vi.fn();
		const handleTouchJoystickStop = vi.fn();

		const result = createGamePageViewModel({
			actionButtons: [],
			activeStateLabel: "entrance",
			cameraStateSnapshot: {
				fov: 58,
				mode: CAMERA_MODES.FREE_ORBITAL,
				position: [0, 8, 10],
				target: [0, 0, 0],
				zoom: 1,
			},
			currentRoomId: ROOM_IDS.ENTRANCE,
			currentRoomLabel: "Entrance",
			discoveredRoomLabels: ["Entrance"],
			enemiesRemaining: 2,
			graphSections: [],
			handleAudioMuteToggle,
			handleCameraModeSwitch,
			handleDungeonRunReset,
			handleMobileSheetOpenChange,
			handleMobileSheetTabChange,
			handleTouchAttack,
			handleTouchInteract,
			handleTouchJoystickMove,
			handleTouchJoystickStop,
			hasTreasureKey: false,
			hasTreasureKeyLabel: "Missing",
			hasTouchAttack: true,
			hasTouchInteract: true,
			isAudioMuted: false,
			isDesktopLayout: true,
			isMobileSheetOpen: false,
			isMobileTabletLandscape: false,
			isTabletLayout: false,
			mobileSheetTabId: "statechart",
			playerHp: 83,
			playerMaxHp: 100,
			touchAttackPrompt: "Attack",
			touchInteractPrompt: "Interact",
		});

		expect(result.canvasMachineRuntime).toEqual({
			currentRoomId: ROOM_IDS.ENTRANCE,
			enemiesRemaining: 2,
			hasTreasureKey: false,
		});
		expect(result.hasTreasureKeyLabel).toBe("Missing");
		expect(result.handleAudioMuteToggle).toBe(handleAudioMuteToggle);
		expect(result.handleCameraModeSwitch).toBe(handleCameraModeSwitch);
		expect(result.handleDungeonRunReset).toBe(handleDungeonRunReset);
		expect(result.handleMobileSheetOpenChange).toBe(
			handleMobileSheetOpenChange,
		);
		expect(result.handleMobileSheetTabChange).toBe(handleMobileSheetTabChange);
		expect(result.handleTouchAttack).toBe(handleTouchAttack);
		expect(result.handleTouchInteract).toBe(handleTouchInteract);
		expect(result.handleTouchJoystickMove).toBe(handleTouchJoystickMove);
		expect(result.handleTouchJoystickStop).toBe(handleTouchJoystickStop);
		expect(result.playerHp).toBe(83);
		expect(result.playerMaxHp).toBe(100);
		expect(result.isDesktopLayout).toBe(true);
		expect(result.mobileSheetTabId).toBe("statechart");
	});
});
