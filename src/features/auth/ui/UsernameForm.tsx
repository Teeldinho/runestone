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
import { AUTH_COPY, USERNAME_PATTERN, USERNAME_RULES } from "../config";
import { type UsernameFormInput, useUsernameForm } from "../model";

type UsernameFormProps = {
	errorMessage: string | null;
	isSubmitting: boolean;
	onSubmit: (input: UsernameFormInput) => Promise<void>;
};

export function UsernameForm({
	errorMessage,
	isSubmitting,
	onSubmit,
}: UsernameFormProps) {
	const usernameInputId = useId();
	const usernameHelpId = useId();
	const usernameErrorId = useId();
	const {
		getUsernameFieldViewModel,
		handleUsernameFormSubmit,
		submitButtonLabel,
		usernameFieldValidators,
		usernameForm,
	} = useUsernameForm({
		errorMessage,
		isSubmitting,
		onSubmit,
	});

	return (
		<form onSubmit={handleUsernameFormSubmit} className="space-y-3">
			<FieldGroup>
				<usernameForm.Field
					name="username"
					validators={usernameFieldValidators}
				>
					{(field) => {
						const { activeErrorMessage } = getUsernameFieldViewModel({
							errors: field.state.meta.errors,
							isTouched: field.state.meta.isTouched,
							isValid: field.state.meta.isValid,
						});
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
									pattern={USERNAME_PATTERN.source}
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
						{submitButtonLabel}
					</Button>
				)}
			</usernameForm.Subscribe>
		</form>
	);
}
