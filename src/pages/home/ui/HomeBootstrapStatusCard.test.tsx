// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AUTH_STATUS } from "@/features/auth";

import { HOME_STATUS_COPY } from "../config";

import { HomeBootstrapStatusCard } from "./HomeBootstrapStatusCard";

afterEach(cleanup);

describe("HomeBootstrapStatusCard", () => {
	it("renders a full-width session status shell while checking", () => {
		render(
			<HomeBootstrapStatusCard
				authStatus={AUTH_STATUS.CHECKING_SESSION}
				errorMessage={null}
				onRetry={vi.fn()}
				readyStatusLabel={null}
			/>,
		);

		expect(
			screen.getByRole("region", { name: "Session status" }).className,
		).toContain("w-full");
		expect(
			screen.getByText(HOME_STATUS_COPY.CHECKING_SESSION.badge),
		).not.toBeNull();
	});

	it("renders the bootstrap failure badge with the shared destructive variant", () => {
		render(
			<HomeBootstrapStatusCard
				authStatus={AUTH_STATUS.BOOTSTRAP_FAILED}
				errorMessage="Convex unreachable"
				onRetry={vi.fn()}
				readyStatusLabel={null}
			/>,
		);

		const alert = screen.getByRole("alert");
		expect(alert.className).toContain("w-full");

		const badge = screen
			.getByText(HOME_STATUS_COPY.BOOTSTRAP_FAILED.badge)
			.closest('[data-slot="badge"]');

		expect(badge).not.toBeNull();
		expect(badge?.getAttribute("data-variant")).toBe("destructive");
		expect(badge?.className).toContain("bg-destructive/10");
		expect(badge?.className).not.toContain("bg-transparent");
		expect(
			screen.getByRole("button", {
				name: HOME_STATUS_COPY.BOOTSTRAP_FAILED.actionLabel,
			}),
		).toBeTruthy();
	});

	it("renders a full-width session status shell when authenticated", () => {
		render(
			<HomeBootstrapStatusCard
				authStatus={AUTH_STATUS.AUTHENTICATED}
				errorMessage={null}
				onRetry={vi.fn()}
				readyStatusLabel="rune-scribe#42"
			/>,
		);

		expect(
			screen.getByRole("region", { name: "Session status" }).className,
		).toContain("w-full");
		expect(
			screen.getByText(HOME_STATUS_COPY.AUTHENTICATED.badge),
		).not.toBeNull();
	});
});
