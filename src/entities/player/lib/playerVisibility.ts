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
			isAvatarVisible: false,
		};
	}

	return {
		isAvatarVisible: true,
	};
};
