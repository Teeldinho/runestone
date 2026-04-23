// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SETTINGS_COPY } from "@/features/settings";
import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/ui";

import { SettingsSheet } from "./SettingsSheet";

vi.mock("./SettingsPanel", () => ({
	SettingsPanel: () => <div data-testid="settings-panel-widget" />,
}));

afterEach(() => {
	cleanup();
});

describe("SettingsSheet", () => {
	it("opens the settings panel from the trigger and keeps it accessible", () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<SettingsSheet>
						<TooltipTrigger asChild>
							<Button type="button">Open Settings</Button>
						</TooltipTrigger>
					</SettingsSheet>
					<TooltipContent>{SETTINGS_COPY.PAGE_TITLE}</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		);

		expect(screen.queryByRole("dialog")).toBeNull();

		fireEvent.click(screen.getByRole("button", { name: "Open Settings" }));

		expect(
			screen.getByRole("dialog", { name: SETTINGS_COPY.PAGE_TITLE }),
		).toBeTruthy();
		expect(screen.getByTestId("settings-panel-widget")).toBeTruthy();

		fireEvent.click(screen.getByRole("button", { name: "Close" }));

		expect(screen.queryByRole("dialog")).toBeNull();
	});
});
