import {
	DoorOpen,
	Lock,
	type LucideIcon,
	Package,
	Workflow,
	Zap,
} from "lucide-react";

import { HOME_TEACHING_ICON_KEYS, type HomeTeachingIconKey } from "../config";

export const resolveHomeTeachingIcon = (
	iconKey: HomeTeachingIconKey,
): LucideIcon => {
	switch (iconKey) {
		case HOME_TEACHING_ICON_KEYS.DOOR_OPEN:
			return DoorOpen;
		case HOME_TEACHING_ICON_KEYS.LOCK:
			return Lock;
		case HOME_TEACHING_ICON_KEYS.PACKAGE:
			return Package;
		case HOME_TEACHING_ICON_KEYS.WORKFLOW:
			return Workflow;
		case HOME_TEACHING_ICON_KEYS.ZAP:
			return Zap;
	}
};
