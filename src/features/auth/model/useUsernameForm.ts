import { revalidateLogic, useForm } from "@tanstack/react-form";
import { type FormEvent, useCallback, useId, useMemo } from "react";

import { AUTH_COPY } from "../config";
import { getUsernameValidationError } from "../lib";

import type { UsernameFormInput } from "./types";

type UseUsernameFormParams = {
	errorMessage: string | null;
	initialUsername?: string;
	isSubmitting: boolean;
	onSubmit: (input: UsernameFormInput) => Promise<void>;
};

type UsernameFieldMeta = {
	errors: unknown[];
	isDirty: boolean;
	isTouched: boolean;
	isValid: boolean;
	value: string;
	submissionAttempts: number;
};

type UsernameFieldViewModel = {
	activeErrorMessage: string | null;
	describedBy: string;
	usernameInputId: string;
	usernameErrorId: string;
	usernameHelpId: string;
};

const getUsernameFieldErrorMessage = (errors: unknown[]): string | null => {
	const firstError = errors[0];

	if (typeof firstError === "string") {
		return firstError;
	}

	return null;
};

export const useUsernameForm = ({
	errorMessage,
	initialUsername = "",
	isSubmitting,
	onSubmit,
}: UseUsernameFormParams) => {
	const usernameInputId = useId();
	const usernameHelpId = useId();
	const usernameErrorId = useId();

	const usernameForm = useForm({
		defaultValues: {
			username: initialUsername,
		},
		validationLogic: revalidateLogic({
			mode: "change",
			modeAfterSubmission: "change",
		}),
		onSubmit: async ({ value }) => {
			await onSubmit(value);
		},
	});

	const usernameFieldValidators = useMemo(
		() => ({
			onChange: ({ value }: { value: string }) =>
				getUsernameValidationError(value),
		}),
		[],
	);

	const handleUsernameFormSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			event.stopPropagation();
			await usernameForm.handleSubmit();
		},
		[usernameForm],
	);

	const getUsernameFieldViewModel = useCallback(
		(fieldMeta: UsernameFieldMeta): UsernameFieldViewModel => {
			const validationErrorMessage = getUsernameFieldErrorMessage(
				fieldMeta.errors,
			);
			const shouldShowValidationError =
				!fieldMeta.isValid &&
				Boolean(validationErrorMessage) &&
				(fieldMeta.value.length > 0 ||
					fieldMeta.isDirty ||
					fieldMeta.isTouched ||
					fieldMeta.submissionAttempts > 0);
			const activeErrorMessage = shouldShowValidationError
				? validationErrorMessage
				: errorMessage;
			const describedBy = activeErrorMessage
				? `${usernameHelpId} ${usernameErrorId}`
				: usernameHelpId;

			return {
				activeErrorMessage,
				describedBy,
				usernameInputId,
				usernameErrorId,
				usernameHelpId,
			};
		},
		[errorMessage, usernameHelpId, usernameErrorId, usernameInputId],
	);

	const submitButtonLabel = isSubmitting
		? AUTH_COPY.USERNAME_SUBMITTING_LABEL
		: AUTH_COPY.USERNAME_SUBMIT_LABEL;

	return {
		getUsernameFieldViewModel,
		handleUsernameFormSubmit,
		submitButtonLabel,
		usernameFieldValidators,
		usernameForm,
	};
};
