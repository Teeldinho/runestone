// @vitest-environment happy-dom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HUD_COPY } from "@/widgets/hud/config";

import { GameHudActionsSection } from "./GameHudActionsSection";

describe("GameHudActionsSection", () => {
	it("keeps machine inputs and restart touch-accessible", () => {
		const handleDungeonActionTrigger = vi.fn();
		const handleDungeonRunReset = vi.fn();

		render(
			<GameHudActionsSection
				actionButtons={[
					{
						eventType: "ENTER_LIBRARY",
						handleDungeonActionTrigger,
						isDisabled: false,
						label: "Enter Library",
					},
				]}
				handleDungeonRunReset={handleDungeonRunReset}
			/>,
		);

		const enterAction = screen.getByRole("button", { name: "Enter Library" });
		const resetAction = screen.getByRole("button", {
			name: HUD_COPY.ACTIONS.RESET_BUTTON,
		});

		expect(enterAction.className).toContain("min-h-11");
		expect(resetAction.className).toContain("min-h-11");

		fireEvent.click(enterAction);
		fireEvent.click(resetAction);

		expect(handleDungeonActionTrigger).toHaveBeenCalledTimes(1);
		expect(handleDungeonRunReset).toHaveBeenCalledTimes(1);
	});
});
