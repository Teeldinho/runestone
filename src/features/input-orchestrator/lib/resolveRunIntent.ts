type ResolveRunIntentInput = {
	readonly isRunToggled: boolean;
};

export const resolveRunIntent = ({
	isRunToggled,
}: ResolveRunIntentInput): boolean => isRunToggled;
