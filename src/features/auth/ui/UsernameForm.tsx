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
	suggestedUsername: string;
	onSubmit: (input: UsernameFormInput) => Promise<void>;
};

export function UsernameForm({
	errorMessage,
	isSubmitting,
	suggestedUsername,
	onSubmit,
}: UsernameFormProps) {
	const {
		getUsernameFieldViewModel,
		handleUsernameFormSubmit,
		submitButtonLabel,
		usernameFieldValidators,
		usernameForm,
	} = useUsernameForm({
		errorMessage,
		initialUsername: suggestedUsername,
		isSubmitting,
		onSubmit,
	});

	return (
		<form onSubmit={handleUsernameFormSubmit} className="space-y-3">
			<FieldGroup>
				<usernameForm.Subscribe selector={(state) => state.submissionAttempts}>
					{(submissionAttempts) => (
						<usernameForm.Field
							name="username"
							validators={usernameFieldValidators}
						>
							{(field) => {
								const {
									activeErrorMessage,
									describedBy,
									usernameInputId,
									usernameErrorId,
									usernameHelpId,
								} = getUsernameFieldViewModel({
									errors: field.state.meta.errors,
									isDirty: field.state.meta.isDirty,
									isTouched: field.state.meta.isTouched,
									isValid: field.state.meta.isValid,
									value: field.state.value,
									submissionAttempts,
								});

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
											className="min-h-11 rounded-xl"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
											aria-invalid={Boolean(activeErrorMessage)}
											aria-describedby={describedBy}
											disabled={isSubmitting}
										/>
										<div className="space-y-1.5">
											<FieldDescription
												id={usernameHelpId}
												className="text-panel-body"
											>
												{AUTH_COPY.USERNAME_HELP_TEXT}
											</FieldDescription>
											<div className="min-h-5">
												<FieldError id={usernameErrorId}>
													{activeErrorMessage}
												</FieldError>
											</div>
										</div>
									</Field>
								);
							}}
						</usernameForm.Field>
					)}
				</usernameForm.Subscribe>
			</FieldGroup>

			<usernameForm.Subscribe
				selector={(state) => ({
					canSubmit: state.canSubmit,
				})}
			>
				{(state) => (
					<Button
						type="submit"
						variant="dungeon-gold"
						className="min-h-11 w-full"
						disabled={isSubmitting || !state.canSubmit}
					>
						{submitButtonLabel}
					</Button>
				)}
			</usernameForm.Subscribe>
		</form>
	);
}
