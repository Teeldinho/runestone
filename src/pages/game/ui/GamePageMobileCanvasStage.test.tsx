// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/features/camera-system";

let mockCameraMode: (typeof CAMERA_MODES)[keyof typeof CAMERA_MODES] =
	CAMERA_MODES.FREE_ORBITAL;

afterEach(() => {
	cleanup();
});

vi.mock("@/pages/game/model", () => ({
	useGamePageCameraElements: () => ({
		cameraControlElement: null,
		cameraControlRef: vi.fn(),
	}),
	useGamePageInputContext: () => ({
		sendInput: vi.fn(),
		isDesktopRunHeld: false,
		isJumpActive: false,
		isMobileRunToggled: false,
		touchMovement: {
			handleMoveVelocity: vi.fn(),
			handleStopVelocity: vi.fn(),
		},
	}),
	useGamePageMobileCanvasStageModel: () => ({
		cameraStateSnapshot: {
			fov: 58,
			mode: mockCameraMode,
			position: [0, 8, 10] as [number, number, number],
			target: [0, 0, 0] as [number, number, number],
			zoom: 1,
			yaw: 0,
			pitch: 0,
			distance: 6,
		},
		canvasMachineRuntime: {
			currentRoomId: "entrance",
			enemiesRemaining: 2,
			hasTreasureKey: false,
		},
		postprocessingEnabled: true,
	}),
}));

vi.mock("@/features/input-orchestrator", () => ({
	MobileActionButtonZone: ({
		isJumpActive,
		isRunEnabled,
	}: {
		isJumpActive: boolean;
		isRunEnabled: boolean;
	}) => (
		<div
			data-testid="mobile-action-button-zone"
			data-jump-active={String(isJumpActive)}
			data-run-enabled={String(isRunEnabled)}
		/>
	),
}));

vi.mock("@/features/touch-input", () => ({
	CameraControlZone: () => <div data-testid="camera-control-zone" />,
	TouchJoystickZone: () => <div data-testid="touch-joystick-zone" />,
}));

vi.mock("@/widgets/game-canvas", () => ({
	GameCanvas: () => <div data-testid="game-canvas" />,
}));

vi.mock("./GamePageMobileActionPanel", () => ({
	GamePageMobileActionPanel: () => (
		<div data-testid="game-page-mobile-action-panel" />
	),
}));

vi.mock("./GamePageMobileTopBar", () => ({
	GamePageMobileTopBar: () => <div data-testid="game-page-mobile-top-bar" />,
}));

import { GamePageMobileCanvasStage } from "./GamePageMobileCanvasStage";

describe("GamePageMobileCanvasStage", () => {
	it("renders the mobile controls as siblings of the camera control zone", () => {
		mockCameraMode = CAMERA_MODES.FREE_ORBITAL;

		render(<GamePageMobileCanvasStage />);
		const mobileActionButtonZone = screen.getByTestId(
			"mobile-action-button-zone",
		);
		const actionPanel = screen.getByTestId("game-page-mobile-action-panel");

		expect(screen.getByTestId("game-canvas")).toBeTruthy();
		expect(screen.getByTestId("camera-control-zone")).toBeTruthy();
		expect(screen.getByTestId("touch-joystick-zone")).toBeTruthy();
		expect(mobileActionButtonZone).toBeTruthy();
		expect(actionPanel).toBeTruthy();
		expect(screen.getByTestId("game-page-mobile-top-bar")).toBeTruthy();
		expect(mobileActionButtonZone.getAttribute("data-run-enabled")).toBe(
			"false",
		);
		expect(mobileActionButtonZone.getAttribute("data-jump-active")).toBe(
			"false",
		);

		expect(
			screen
				.getByTestId("touch-joystick-zone")
				.closest('[data-testid="camera-control-zone"]'),
		).toBeNull();
		expect(
			mobileActionButtonZone.closest('[data-testid="camera-control-zone"]'),
		).toBeNull();
		expect(
			actionPanel.closest('[data-testid="camera-control-zone"]'),
		).toBeNull();
		expect(
			screen
				.getByTestId("game-page-mobile-top-bar")
				.closest('[data-testid="camera-control-zone"]'),
		).toBeNull();
		expect(mobileActionButtonZone.parentElement).toBe(
			actionPanel.parentElement,
		);
		expect(
			mobileActionButtonZone.parentElement?.classList.contains("absolute"),
		).toBe(true);
		expect(
			mobileActionButtonZone.parentElement?.classList.contains("right-4"),
		).toBe(true);
		expect(
			mobileActionButtonZone.parentElement?.classList.contains("bottom-4"),
		).toBe(true);
	});

	it("keeps the camera surface mounted in first-person mode", () => {
		mockCameraMode = CAMERA_MODES.FIRST_PERSON;

		render(<GamePageMobileCanvasStage />);

		expect(screen.getByTestId("camera-control-zone")).toBeTruthy();
	});
});
