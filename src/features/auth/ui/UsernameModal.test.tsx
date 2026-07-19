// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AUTH_COPY } from "../config";

import { UsernameModal } from "./UsernameModal";

afterEach(cleanup);

describe("UsernameModal", () => {
	it("offers dungeon entry and a keep-reading action", () => {
		const handleSubmit = vi.fn();
		const handleKeepReading = vi.fn();

		render(
			<UsernameModal
				errorMessage={null}
				isOpen
				isSubmitting={false}
				suggestedUsername="Rune_AshBearAAAA"
				onKeepReading={handleKeepReading}
				onSubmit={handleSubmit}
			/>,
		);

		expect(
			screen.getByRole("button", {
				name: AUTH_COPY.USERNAME_SUBMIT_LABEL,
			}),
		).not.toBeNull();
		expect(screen.queryByText(/no (account|password|sign-in)/i)).toBeNull();

		fireEvent.click(
			screen.getByRole("button", {
				name: AUTH_COPY.MODAL_KEEP_READING_LABEL,
			}),
		);

		expect(handleKeepReading).toHaveBeenCalledOnce();
	});
});
