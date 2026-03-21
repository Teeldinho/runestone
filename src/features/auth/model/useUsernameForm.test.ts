// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { AUTH_COPY } from "../config";

import { useUsernameForm } from "./useUsernameForm";

describe("useUsernameForm", () => {
	it("returns submit label from submitting state", () => {
		const { result, rerender } = renderHook(
			({ isSubmitting }) =>
				useUsernameForm({
					errorMessage: null,
					isSubmitting,
					onSubmit: vi.fn(),
				}),
			{
				initialProps: {
					isSubmitting: false,
				},
			},
		);

		expect(result.current.submitButtonLabel).toBe(
			AUTH_COPY.USERNAME_SUBMIT_LABEL,
		);

		rerender({
			isSubmitting: true,
		});

		expect(result.current.submitButtonLabel).toBe("Summoning profile...");
	});

	it("prioritizes validation errors over external submit errors", () => {
		const { result } = renderHook(() =>
			useUsernameForm({
				errorMessage: "unable to create user",
				isSubmitting: false,
				onSubmit: vi.fn(),
			}),
		);

		expect(
			result.current.getUsernameFieldViewModel({
				errors: ["Use 3-20 letters, numbers, or underscores."],
				isTouched: true,
				isValid: false,
			}).activeErrorMessage,
		).toBe("Use 3-20 letters, numbers, or underscores.");

		expect(
			result.current.getUsernameFieldViewModel({
				errors: ["Use 3-20 letters, numbers, or underscores."],
				isTouched: false,
				isValid: false,
			}).activeErrorMessage,
		).toBe("unable to create user");
	});

	it("submits form values with guarded submit event handling", async () => {
		const handleUsernameSubmit = vi.fn().mockResolvedValue(undefined);
		const preventDefault = vi.fn();
		const stopPropagation = vi.fn();

		const { result } = renderHook(() =>
			useUsernameForm({
				errorMessage: null,
				isSubmitting: false,
				onSubmit: handleUsernameSubmit,
			}),
		);

		await act(async () => {
			result.current.usernameForm.setFieldValue("username", "runestone_hero");
			await result.current.handleUsernameFormSubmit({
				preventDefault,
				stopPropagation,
			} as unknown as FormEvent<HTMLFormElement>);
		});

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(stopPropagation).toHaveBeenCalledTimes(1);
		expect(handleUsernameSubmit).toHaveBeenCalledWith({
			username: "runestone_hero",
		});
	});
});
