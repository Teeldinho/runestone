import { describe, expect, it, vi } from "vitest";

import { createGamePageMobileLayoutShellViewModel } from "./createGamePageMobileLayoutShellViewModel";

describe("createGamePageMobileLayoutShellViewModel", () => {
	it("closes the drawer, blocks input, and hides sheet content in portrait layout", () => {
		const handleMobileSheetOpenChange = vi.fn();

		const viewModel = createGamePageMobileLayoutShellViewModel({
			handleMobileSheetOpenChange,
			isMobileSheetOpen: true,
			isPortraitLayout: true,
		});

		viewModel.handleDrawerOpenChange(true);

		expect(viewModel.drawerOpen).toBe(false);
		expect(viewModel.isInputBlocked).toBe(true);
		expect(viewModel.isPortraitGateVisible).toBe(true);
		expect(viewModel.shouldRenderSheetContent).toBe(false);
		expect(handleMobileSheetOpenChange).not.toHaveBeenCalled();
	});

	it("keeps drawer behavior active outside portrait layout", () => {
		const handleMobileSheetOpenChange = vi.fn();

		const viewModel = createGamePageMobileLayoutShellViewModel({
			handleMobileSheetOpenChange,
			isMobileSheetOpen: true,
			isPortraitLayout: false,
		});

		viewModel.handleDrawerOpenChange(false);

		expect(viewModel.drawerOpen).toBe(true);
		expect(viewModel.isInputBlocked).toBe(false);
		expect(viewModel.isPortraitGateVisible).toBe(false);
		expect(viewModel.shouldRenderSheetContent).toBe(true);
		expect(handleMobileSheetOpenChange).toHaveBeenCalledWith(false);
	});
});
