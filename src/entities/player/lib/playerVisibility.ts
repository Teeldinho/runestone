import { CAMERA_MODES } from "@/shared/config";

import type {
	PlayerAvatarVisibility,
	ResolvePlayerAvatarVisibilityInput,
} from "../model";

export const resolvePlayerAvatarVisibility = ({
	cameraMode,
}: ResolvePlayerAvatarVisibilityInput): PlayerAvatarVisibility => {
	if (cameraMode === CAMERA_MODES.FIRST_PERSON) {
		return {
			isAuraVisible: false,
			isAvatarVisible: false,
		};
	}

	return {
		isAuraVisible: true,
		isAvatarVisible: true,
	};
};
