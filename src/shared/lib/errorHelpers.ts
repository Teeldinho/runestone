export const deduplicateErrorMessages = (
	errors: Array<{ message?: string } | undefined>,
): string[] => {
	return [
		...new Map(
			errors
				.filter((error): error is { message?: string } =>
					Boolean(error?.message),
				)
				.map((error) => [error.message as string, error]),
		).keys(),
	];
};
