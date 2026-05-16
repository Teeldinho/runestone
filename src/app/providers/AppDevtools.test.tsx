// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-query-devtools", () => ({
	ReactQueryDevtools: ({ initialIsOpen }: { initialIsOpen?: boolean }) => (
		<div
			data-initial-is-open={String(initialIsOpen)}
			data-testid="react-query-devtools"
		/>
	),
}));

import { AppDevtools } from "./AppDevtools";

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});

describe("AppDevtools", () => {
	it("renders the query devtools open by default in development", () => {
		render(<AppDevtools />);

		expect(screen.getByTestId("react-query-devtools")).toBeTruthy();
		expect(
			screen
				.getByTestId("react-query-devtools")
				.getAttribute("data-initial-is-open"),
		).toBe("true");
	});
});
