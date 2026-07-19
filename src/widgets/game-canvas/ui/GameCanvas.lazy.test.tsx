// @vitest-environment happy-dom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ROOM_IDS } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";

vi.mock("./GameCanvasRuntime", () => ({
	GameCanvasRuntime: () => <div role="status" aria-label="Loaded 3D runtime" />,
}));

import { GameCanvas } from "./GameCanvas";

describe("GameCanvas lazy boundary", () => {
	it("shows the scene loading status while the 3D runtime resolves", async () => {
		render(
			<GameCanvas
				cameraStateSnapshot={{
					fov: 58,
					mode: CAMERA_MODES.FREE_ORBITAL,
					position: [0, 16, -18],
					target: [0, 0, 0],
					zoom: 1,
					yaw: 0,
					pitch: 0,
					distance: 6,
				}}
				machineRuntime={{
					currentRoomId: ROOM_IDS.ENTRANCE,
					enemiesRemaining: 1,
					hasTreasureKey: false,
				}}
				postprocessingEnabled={false}
			/>,
		);

		expect(screen.getByLabelText("Loading dungeon scene")).toBeTruthy();
		expect(
			await screen.findByRole("status", { name: "Loaded 3D runtime" }),
		).toBeTruthy();
	});
});
