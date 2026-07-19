// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mockUseGamePageMobileSheetContentModel = vi.fn();

vi.mock("@/pages/game/model", () => ({
	useGamePageMobileSheetContentModel: () =>
		mockUseGamePageMobileSheetContentModel(),
}));

vi.mock("@/shared/ui", () => ({
	Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	CardContent: ({
		className,
		children,
	}: {
		className?: string;
		children: ReactNode;
	}) => (
		<div data-testid="card-content" className={className}>
			{children}
		</div>
	),
	ScrollArea: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	TabsContent: ({
		children,
		className,
		value,
	}: {
		children: ReactNode;
		className?: string;
		value: string;
	}) => (
		<div data-testid="tabs-content" data-value={value} className={className}>
			{children}
		</div>
	),
}));

vi.mock("@/widgets/xstate-inspector-panel", () => ({
	XStateInspectorDetailsPanel: () => <div data-testid="inspector-details" />,
	XStateInspectorPanel: ({ minZoom }: { minZoom?: number }) => (
		<div data-testid="inspector-panel" data-min-zoom={minZoom} />
	),
}));

import { GamePageMobileStatechartTab } from "./GamePageMobileStatechartTab";

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});

describe("GamePageMobileStatechartTab", () => {
	it("uses taller cards on phones", () => {
		mockUseGamePageMobileSheetContentModel.mockReturnValue({
			drawerContentHeightClassName: "h-[90dvh]",
			graphSections: [],
			isTabletLayout: false,
		});

		render(<GamePageMobileStatechartTab />);

		const cards = screen.getAllByTestId("card-content");

		expect(cards[0].className).toContain("h-[30rem]");
		expect(cards[0].className).toContain("min-h-[24rem]");
		expect(cards[1].className).toContain("h-[22rem]");
		expect(cards[1].className).toContain("min-h-[16rem]");
		expect(
			screen.getByTestId("inspector-panel").getAttribute("data-min-zoom"),
		).toBe("1");
	});

	it("keeps the tablet card heights", () => {
		mockUseGamePageMobileSheetContentModel.mockReturnValue({
			drawerContentHeightClassName: "h-[90dvh]",
			graphSections: [],
			isTabletLayout: true,
		});

		render(<GamePageMobileStatechartTab />);

		const cards = screen.getAllByTestId("card-content");

		expect(cards[0].className).toContain("h-[27.5rem]");
		expect(cards[0].className).toContain("min-h-[22.5rem]");
		expect(cards[1].className).toContain("h-[20rem]");
		expect(cards[1].className).toContain("min-h-[15rem]");
	});
});
