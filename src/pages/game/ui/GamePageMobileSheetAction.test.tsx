// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	TooltipProvider,
} from "@/shared/ui";

import { GamePageMobileSheetAction } from "./GamePageMobileSheetAction";

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

function GamePageMobileSheetActionHarness() {
	const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

	return (
		<TooltipProvider>
			<Drawer open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
				<GamePageMobileSheetAction
					sheetTrigger={{
						isMobileSheetOpen,
						isTabletLayout: true,
					}}
				/>
				<DrawerContent aria-label="Game bottom sheet panels">
					<DrawerHeader>
						<DrawerTitle>Panels</DrawerTitle>
						<DrawerDescription>Game page panels</DrawerDescription>
					</DrawerHeader>
					<div>Panels drawer content</div>
				</DrawerContent>
			</Drawer>
		</TooltipProvider>
	);
}

describe("GamePageMobileSheetAction", () => {
	it("opens the panels drawer from the trigger", () => {
		render(<GamePageMobileSheetActionHarness />);

		expect(screen.queryByText("Panels drawer content")).toBeNull();

		fireEvent.click(screen.getByRole("button", { name: "Open Panels" }));

		expect(screen.getByText("Panels drawer content")).toBeTruthy();
	});
});
