// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/features/camera-system";
import {
	GAME_PAGE_MOBILE_OVERLAY_CLASS_NAMES,
	GAME_PAGE_MOBILE_OVERLAY_TEST_IDS,
} from "@/pages/game/config";

const INPUT_STATE_KEYS = {
	READY: "ready",
	MOVEMENT_REGION: "movementRegion",
	MOVEMENT_IDLE: "movementIdle",
	RUN_TOGGLE_REGION: "runToggleRegion",
	RUN_TOGGLE_OFF: "runToggleOff",
} as const;

const MOBILE_STAGE_TEST_IDS = {
	ACTION_PANEL: "game-page-mobile-action-panel",
	CAMERA_CONTROL_ZONE: "camera-control-zone",
	GAME_CANVAS: "game-canvas",
	MOBILE_ACTION_BUTTON_ZONE: "mobile-action-button-zone",
	TOP_BAR: "game-page-mobile-top-bar",
	TOUCH_JOYSTICK_ZONE: "touch-joystick-zone",
} as const;

let mockCameraMode: (typeof CAMERA_MODES)[keyof typeof CAMERA_MODES] =
	CAMERA_MODES.FREE_ORBITAL;
let mockIsInputBlocked = false;
let mockTouchPromptsVisible = false;

afterEach(() => {
	cleanup();
	mockCameraMode = CAMERA_MODES.FREE_ORBITAL;
	mockIsInputBlocked = false;
	mockTouchPromptsVisible = false;
});

vi.mock("@/pages/game/model", () => ({
	useGamePageCameraElements: () => ({
		cameraControlElement: null,
		cameraControlRef: vi.fn(),
	}),
	useGamePageInputContext: () => ({
		inputStateValue: {
			ready: {
				movementRegion: INPUT_STATE_KEYS.MOVEMENT_IDLE,
				runToggleRegion: INPUT_STATE_KEYS.RUN_TOGGLE_OFF,
			},
		},
		sendInput: vi.fn(),
		isRunToggled: false,
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
		isInputBlocked: mockIsInputBlocked,
		postprocessingEnabled: true,
	}),
}));

vi.mock("@/features/input-orchestrator", () => ({
	MobileActionButtonZone: ({ isRunEnabled }: { isRunEnabled: boolean }) => (
		<div
			data-testid={MOBILE_STAGE_TEST_IDS.MOBILE_ACTION_BUTTON_ZONE}
			data-run-enabled={String(isRunEnabled)}
		/>
	),
}));

vi.mock("@/features/touch-input", () => ({
	CameraControlZone: () => (
		<div data-testid={MOBILE_STAGE_TEST_IDS.CAMERA_CONTROL_ZONE} />
	),
	TouchJoystickZone: () => (
		<div data-testid={MOBILE_STAGE_TEST_IDS.TOUCH_JOYSTICK_ZONE} />
	),
}));

vi.mock("@/widgets/game-canvas", () => ({
	GameCanvas: () => <div data-testid={MOBILE_STAGE_TEST_IDS.GAME_CANVAS} />,
}));

vi.mock("./GamePageMobileActionPanel", () => ({
	GamePageMobileActionPanel: () => (
		<div
			data-testid={MOBILE_STAGE_TEST_IDS.ACTION_PANEL}
			data-touch-prompts-visible={String(mockTouchPromptsVisible)}
		/>
	),
}));

vi.mock("./GamePageMobileTopBar", () => ({
	GamePageMobileTopBar: () => (
		<div data-testid={MOBILE_STAGE_TEST_IDS.TOP_BAR} />
	),
}));

import { GamePageMobileCanvasStage } from "./GamePageMobileCanvasStage";

describe("GamePageMobileCanvasStage", () => {
	it("renders the mobile controls as sibling columns in the overlay row", () => {
		mockCameraMode = CAMERA_MODES.FREE_ORBITAL;

		render(<GamePageMobileCanvasStage />);
		const overlayRow = screen.getByTestId(
			GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.ROOT,
		);
		const mobileActionButtonZone = screen.getByTestId(
			MOBILE_STAGE_TEST_IDS.MOBILE_ACTION_BUTTON_ZONE,
		);
		const actionPanel = screen.getByTestId(MOBILE_STAGE_TEST_IDS.ACTION_PANEL);
		const runJumpAnchor = screen.getByTestId(
			GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.RUN_JUMP_ANCHOR,
		);
		const actionPanelAnchor = screen.getByTestId(
			GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.ACTION_PANEL_ANCHOR,
		);

		expect(screen.getByTestId(MOBILE_STAGE_TEST_IDS.GAME_CANVAS)).toBeTruthy();
		expect(
			screen.getByTestId(MOBILE_STAGE_TEST_IDS.CAMERA_CONTROL_ZONE),
		).toBeTruthy();
		expect(
			screen.getByTestId(MOBILE_STAGE_TEST_IDS.TOUCH_JOYSTICK_ZONE),
		).toBeTruthy();
		expect(mobileActionButtonZone).toBeTruthy();
		expect(actionPanel).toBeTruthy();
		expect(screen.getByTestId(MOBILE_STAGE_TEST_IDS.TOP_BAR)).toBeTruthy();
		expect(mobileActionButtonZone.getAttribute("data-run-enabled")).toBe(
			"false",
		);
		expect(overlayRow.className).toBe(
			GAME_PAGE_MOBILE_OVERLAY_CLASS_NAMES.ROOT,
		);
		expect(runJumpAnchor.className).toBe(
			GAME_PAGE_MOBILE_OVERLAY_CLASS_NAMES.RUN_JUMP_ANCHOR,
		);
		expect(actionPanelAnchor.className).toBe(
			GAME_PAGE_MOBILE_OVERLAY_CLASS_NAMES.ACTION_PANEL_ANCHOR,
		);
		expect(runJumpAnchor.parentElement).toBe(overlayRow);
		expect(actionPanelAnchor.parentElement).toBe(overlayRow);
		expect(
			screen
				.getByTestId(MOBILE_STAGE_TEST_IDS.TOUCH_JOYSTICK_ZONE)
				.closest(
					`[data-testid="${MOBILE_STAGE_TEST_IDS.CAMERA_CONTROL_ZONE}"]`,
				),
		).toBeNull();
		expect(
			mobileActionButtonZone.closest(
				`[data-testid="${MOBILE_STAGE_TEST_IDS.CAMERA_CONTROL_ZONE}"]`,
			),
		).toBeNull();
		expect(
			actionPanel.closest(
				`[data-testid="${MOBILE_STAGE_TEST_IDS.CAMERA_CONTROL_ZONE}"]`,
			),
		).toBeNull();
		expect(
			screen
				.getByTestId(MOBILE_STAGE_TEST_IDS.TOP_BAR)
				.closest(
					`[data-testid="${MOBILE_STAGE_TEST_IDS.CAMERA_CONTROL_ZONE}"]`,
				),
		).toBeNull();
		expect(runJumpAnchor.className.includes("absolute")).toBe(false);
		expect(actionPanelAnchor.className.includes("absolute")).toBe(false);
	});

	it("keeps the overlay row stable when touch prompts toggle", () => {
		const { rerender } = render(<GamePageMobileCanvasStage />);
		const overlayRow = screen.getByTestId(
			GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.ROOT,
		);
		const runJumpAnchor = screen.getByTestId(
			GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.RUN_JUMP_ANCHOR,
		);
		const actionPanelAnchor = screen.getByTestId(
			GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.ACTION_PANEL_ANCHOR,
		);
		const actionPanel = screen.getByTestId(MOBILE_STAGE_TEST_IDS.ACTION_PANEL);
		const initialOverlayRowClassName = overlayRow.className;
		const initialRunJumpAnchorClassName = runJumpAnchor.className;
		const initialActionPanelAnchorClassName = actionPanelAnchor.className;

		expect(actionPanel.getAttribute("data-touch-prompts-visible")).toBe(
			"false",
		);

		mockTouchPromptsVisible = true;

		rerender(<GamePageMobileCanvasStage />);

		expect(
			screen
				.getByTestId(MOBILE_STAGE_TEST_IDS.ACTION_PANEL)
				.getAttribute("data-touch-prompts-visible"),
		).toBe("true");
		expect(
			screen.getByTestId(GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.RUN_JUMP_ANCHOR)
				.parentElement,
		).toBe(screen.getByTestId(GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.ROOT));
		expect(
			screen.getByTestId(GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.ACTION_PANEL_ANCHOR)
				.parentElement,
		).toBe(screen.getByTestId(GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.ROOT));
		expect(
			screen.getByTestId(GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.ROOT).className,
		).toBe(initialOverlayRowClassName);
		expect(
			screen.getByTestId(GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.RUN_JUMP_ANCHOR)
				.className,
		).toBe(initialRunJumpAnchorClassName);
		expect(
			screen.getByTestId(GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.ACTION_PANEL_ANCHOR)
				.className,
		).toBe(initialActionPanelAnchorClassName);
	});

	it("keeps the camera surface mounted in first-person mode", () => {
		mockCameraMode = CAMERA_MODES.FIRST_PERSON;

		render(<GamePageMobileCanvasStage />);

		expect(
			screen.getByTestId(MOBILE_STAGE_TEST_IDS.CAMERA_CONTROL_ZONE),
		).toBeTruthy();
	});

	it("hides the mobile gameplay controls in portrait mode", () => {
		mockIsInputBlocked = true;

		render(<GamePageMobileCanvasStage />);

		expect(screen.getByTestId(MOBILE_STAGE_TEST_IDS.GAME_CANVAS)).toBeTruthy();
		expect(
			screen.queryByTestId(MOBILE_STAGE_TEST_IDS.CAMERA_CONTROL_ZONE),
		).toBeNull();
		expect(
			screen.queryByTestId(MOBILE_STAGE_TEST_IDS.TOUCH_JOYSTICK_ZONE),
		).toBeNull();
		expect(
			screen.queryByTestId(MOBILE_STAGE_TEST_IDS.MOBILE_ACTION_BUTTON_ZONE),
		).toBeNull();
		expect(screen.queryByTestId(MOBILE_STAGE_TEST_IDS.ACTION_PANEL)).toBeNull();
		expect(screen.queryByTestId(MOBILE_STAGE_TEST_IDS.TOP_BAR)).toBeNull();
		expect(
			screen.queryByTestId(GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.RUN_JUMP_ANCHOR),
		).toBeNull();
		expect(
			screen.queryByTestId(
				GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.ACTION_PANEL_ANCHOR,
			),
		).toBeNull();
		expect(
			screen.queryByTestId(GAME_PAGE_MOBILE_OVERLAY_TEST_IDS.ROOT),
		).toBeNull();
	});

	it("suppresses the mobile gameplay context menu", () => {
		render(<GamePageMobileCanvasStage />);

		const section = screen.getByText("Dungeon Canvas").closest("section");

		expect(section).not.toBeNull();
		expect(section?.classList.contains("gameplay-touch-surface")).toBe(true);
		expect(fireEvent.contextMenu(section as HTMLElement)).toBe(false);
	});
});
