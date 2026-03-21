import { useForm } from "@tanstack/react-form";
import { useId } from "react";
import {
	Button,
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	Input,
} from "@/shared/ui";
import { AUTH_COPY, USERNAME_RULES } from "../config";
import { getUsernameValidationError } from "../lib";
import type { UsernameFormInput } from "../model";

type UsernameFormProps = {
	errorMessage: string | null;
	isSubmitting: boolean;
	onSubmit: (input: UsernameFormInput) => Promise<void>;
};

const getFieldErrorMessage = (errors: unknown[]): string | null => {
	const firstError = errors[0];

	if (typeof firstError === "string") {
		return firstError;
	}

	return null;
};

export function UsernameForm({
	errorMessage,
	isSubmitting,
	onSubmit,
}: UsernameFormProps) {
	const usernameInputId = useId();
	const usernameHelpId = useId();
	const usernameErrorId = useId();

	const usernameForm = useForm({
		defaultValues: {
			username: "",
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value);
		},
	});

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				void usernameForm.handleSubmit();
			}}
			className="space-y-3"
		>
			<FieldGroup>
				<usernameForm.Field
					name="username"
					validators={{
						onChange: ({ value }) => getUsernameValidationError(value),
						onBlur: ({ value }) => getUsernameValidationError(value),
					}}
				>
					{(field) => {
						const validationErrorMessage = getFieldErrorMessage(
							field.state.meta.errors,
						);
						const shouldShowValidationError =
							field.state.meta.isTouched && !field.state.meta.isValid;
						const activeErrorMessage = shouldShowValidationError
							? validationErrorMessage
							: errorMessage;
						const describedBy = activeErrorMessage
							? `${usernameHelpId} ${usernameErrorId}`
							: usernameHelpId;

						return (
							<Field data-invalid={Boolean(activeErrorMessage)}>
								<FieldLabel
									htmlFor={usernameInputId}
									className="text-panel-title"
								>
									{AUTH_COPY.USERNAME_LABEL}
								</FieldLabel>
								<Input
									id={usernameInputId}
									name={field.name}
									required
									minLength={USERNAME_RULES.MIN_LENGTH}
									maxLength={USERNAME_RULES.MAX_LENGTH}
									pattern={USERNAME_RULES.PATTERN.source}
									autoComplete="username"
									placeholder={AUTH_COPY.USERNAME_PLACEHOLDER}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
									aria-invalid={Boolean(activeErrorMessage)}
									aria-describedby={describedBy}
									disabled={isSubmitting}
								/>
								<FieldDescription
									id={usernameHelpId}
									className="text-panel-body"
								>
									{AUTH_COPY.USERNAME_HELP_TEXT}
								</FieldDescription>
								<FieldError id={usernameErrorId}>
									{activeErrorMessage}
								</FieldError>
							</Field>
						);
					}}
				</usernameForm.Field>
			</FieldGroup>

			<usernameForm.Subscribe
				selector={(state) => ({
					canSubmit: state.canSubmit,
				})}
			>
				{(state) => (
					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting || !state.canSubmit}
					>
						{isSubmitting
							? "Summoning profile..."
							: AUTH_COPY.USERNAME_SUBMIT_LABEL}
					</Button>
				)}
			</usernameForm.Subscribe>
		</form>
	);
}
