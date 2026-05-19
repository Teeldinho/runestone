import { MOBILE_ACTION_BUTTON_VARIANTS } from "../config";

type ResolveMobileActionButtonZoneViewStateInput = {
	readonly isJumpPressed: boolean;
	readonly isRunEnabled: boolean;
};

type ResolveMobileActionButtonZoneViewStateResult = {
	readonly jumpButtonPressed: boolean;
	readonly jumpButtonVariant: (typeof MOBILE_ACTION_BUTTON_VARIANTS)[keyof typeof MOBILE_ACTION_BUTTON_VARIANTS];
	readonly runButtonPressed: boolean;
	readonly runButtonVariant: (typeof MOBILE_ACTION_BUTTON_VARIANTS)[keyof typeof MOBILE_ACTION_BUTTON_VARIANTS];
};

export const resolveMobileActionButtonZoneViewState = ({
	isJumpPressed,
	isRunEnabled,
}: ResolveMobileActionButtonZoneViewStateInput): ResolveMobileActionButtonZoneViewStateResult => ({
	jumpButtonPressed: isJumpPressed,
	jumpButtonVariant: isJumpPressed
		? MOBILE_ACTION_BUTTON_VARIANTS.ACTIVE
		: MOBILE_ACTION_BUTTON_VARIANTS.INACTIVE,
	runButtonPressed: isRunEnabled,
	runButtonVariant: isRunEnabled
		? MOBILE_ACTION_BUTTON_VARIANTS.ACTIVE
		: MOBILE_ACTION_BUTTON_VARIANTS.INACTIVE,
});

export type {
	ResolveMobileActionButtonZoneViewStateInput,
	ResolveMobileActionButtonZoneViewStateResult,
};
