// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AUTH_COPY } from "../config";

import { UsernameForm } from "./UsernameForm";

afterEach(cleanup);

describe("UsernameForm", () => {
	it("shows invalid username feedback during change without requiring blur", () => {
		render(
			<UsernameForm
				errorMessage={null}
				isSubmitting={false}
				onSubmit={vi.fn()}
			/>,
		);

		const usernameInput = screen.getByLabelText(AUTH_COPY.USERNAME_LABEL);
		const submitButton = screen.getByRole("button", {
			name: AUTH_COPY.USERNAME_SUBMIT_LABEL,
		});

		expect(usernameInput.getAttribute("placeholder")).toBe(
			AUTH_COPY.USERNAME_PLACEHOLDER,
		);

		fireEvent.change(screen.getByLabelText(AUTH_COPY.USERNAME_LABEL), {
			target: { value: "ab" },
		});

		expect(screen.getByRole("alert").textContent).toBe(
			AUTH_COPY.USERNAME_VALIDATION_ERROR,
		);
		expect(
			screen
				.getByLabelText(AUTH_COPY.USERNAME_LABEL)
				.getAttribute("aria-invalid"),
		).toBe("true");
		expect(submitButton.hasAttribute("disabled")).toBe(true);

		fireEvent.change(usernameInput, {
			target: { value: "runestone_hero" },
		});

		expect(screen.queryByRole("alert")).toBeNull();
		expect(usernameInput.getAttribute("aria-invalid")).toBe("false");
		expect(submitButton.hasAttribute("disabled")).toBe(false);
	});

	it("keeps external submit errors visible when field validation is not active", () => {
		render(
			<UsernameForm
				errorMessage="Unable to create profile"
				isSubmitting={false}
				onSubmit={vi.fn()}
			/>,
		);

		expect(screen.getByRole("alert").textContent).toBe(
			"Unable to create profile",
		);
		expect(
			screen
				.getByLabelText(AUTH_COPY.USERNAME_LABEL)
				.getAttribute("aria-describedby"),
		).toContain(" ");
	});
});
