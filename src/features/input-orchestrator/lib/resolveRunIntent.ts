type ResolveRunIntentInput = {
	readonly isDesktopRunHeld: boolean;
	readonly isMobileRunToggled: boolean;
};

export const resolveRunIntent = ({
	isDesktopRunHeld,
	isMobileRunToggled,
}: ResolveRunIntentInput): boolean => isDesktopRunHeld || isMobileRunToggled;
