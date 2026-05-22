// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { AUTH_COPY } from "../config";

import { useUsernameForm } from "./useUsernameForm";

describe("useUsernameForm", () => {
	it("prefills the username field from the suggested username", () => {
		const { result } = renderHook(() =>
			useUsernameForm({
				errorMessage: null,
				initialUsername: "Rune_AshBearAAAA",
				isSubmitting: false,
				onSubmit: vi.fn(),
			}),
		);

		expect(result.current.usernameForm.state.values.username).toBe(
			"Rune_AshBearAAAA",
		);
	});

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

		expect(result.current.submitButtonLabel).toBe(
			AUTH_COPY.USERNAME_SUBMITTING_LABEL,
		);
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
				errors: [AUTH_COPY.USERNAME_VALIDATION_ERROR],
				isDirty: true,
				isTouched: true,
				isValid: false,
				value: "ab",
				submissionAttempts: 0,
			}).activeErrorMessage,
		).toBe(AUTH_COPY.USERNAME_VALIDATION_ERROR);

		expect(
			result.current.getUsernameFieldViewModel({
				errors: [AUTH_COPY.USERNAME_VALIDATION_ERROR],
				isDirty: true,
				isTouched: true,
				isValid: false,
				value: "ab",
				submissionAttempts: 0,
			}).activeErrorMessage,
		).toBe(AUTH_COPY.USERNAME_VALIDATION_ERROR);

		expect(
			result.current.getUsernameFieldViewModel({
				errors: [],
				isDirty: false,
				isTouched: false,
				isValid: true,
				value: "runestone_hero",
				submissionAttempts: 0,
			}).activeErrorMessage,
		).toBe("unable to create user");
	});

	it("shows validation errors after the username field changes without requiring blur", () => {
		const { result } = renderHook(() =>
			useUsernameForm({
				errorMessage: null,
				isSubmitting: false,
				onSubmit: vi.fn(),
			}),
		);

		expect(
			result.current.getUsernameFieldViewModel({
				errors: [AUTH_COPY.USERNAME_VALIDATION_ERROR],
				isDirty: false,
				isTouched: false,
				isValid: false,
				value: "ab",
				submissionAttempts: 0,
			}).activeErrorMessage,
		).toBe(AUTH_COPY.USERNAME_VALIDATION_ERROR);
	});

	it("shows validation errors after a submit attempt even before blur", () => {
		const { result } = renderHook(() =>
			useUsernameForm({
				errorMessage: null,
				isSubmitting: false,
				onSubmit: vi.fn(),
			}),
		);

		expect(
			result.current.getUsernameFieldViewModel({
				errors: [AUTH_COPY.USERNAME_VALIDATION_ERROR],
				isDirty: false,
				isTouched: false,
				isValid: false,
				value: "",
				submissionAttempts: 1,
			}).activeErrorMessage,
		).toBe(AUTH_COPY.USERNAME_VALIDATION_ERROR);
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
