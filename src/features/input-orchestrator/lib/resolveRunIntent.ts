type ResolveRunIntentInput = {
	readonly isDesktopRunHeld: boolean;
	readonly isMobileRunToggled: boolean;
	readonly isMobileMagnitudeRun: boolean;
};

export const resolveRunIntent = ({
	isDesktopRunHeld,
	isMobileRunToggled,
	isMobileMagnitudeRun,
}: ResolveRunIntentInput): boolean =>
	isDesktopRunHeld || isMobileRunToggled || isMobileMagnitudeRun;
