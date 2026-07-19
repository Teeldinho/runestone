// @vitest-environment happy-dom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GameRoutePendingShell } from "./-GameRoutePendingShell";

describe("GameRoutePendingShell", () => {
	it("announces loading while preserving the Observatory frame", () => {
		render(<GameRoutePendingShell />);

		expect(
			screen.getByRole("status", { name: "Loading Dungeon Observatory" }),
		).toBeTruthy();
		expect(screen.getByRole("main").getAttribute("aria-busy")).toBe("true");
		expect(screen.getByText("Dungeon Observatory")).toBeTruthy();
	});
});
