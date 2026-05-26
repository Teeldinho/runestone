import {
	ChevronsUp,
	Footprints,
	Gamepad2,
	type LucideIcon,
} from "lucide-react";

import { TUTORIAL_ICON_KEYS, type TutorialIconKey } from "../config";

export const resolveTutorialIcon = (iconKey: TutorialIconKey): LucideIcon => {
	switch (iconKey) {
		case TUTORIAL_ICON_KEYS.CHEVRONS_UP:
			return ChevronsUp;
		case TUTORIAL_ICON_KEYS.FOOTPRINTS:
			return Footprints;
		case TUTORIAL_ICON_KEYS.GAMEPAD:
			return Gamepad2;
	}
};
