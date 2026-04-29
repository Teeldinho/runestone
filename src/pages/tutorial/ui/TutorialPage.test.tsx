// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TUTORIAL_COPY } from "../config";

import { TutorialPage } from "./TutorialPage";

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children }: { children: ReactNode }) => (
		<a href="/game">{children}</a>
	),
}));

afterEach(cleanup);

describe("TutorialPage", () => {
	it("renders the how-to-play content inside a mobile-safe scroll container", () => {
		render(<TutorialPage />);

		const tutorialPage = screen
			.getByRole("heading", { name: TUTORIAL_COPY.HEADING })
			.closest("main");

		expect(tutorialPage?.className).toContain("h-dvh");
		expect(tutorialPage?.className).toContain("overflow-y-auto");
		expect(tutorialPage?.className).toContain("overscroll-contain");
	});
});
