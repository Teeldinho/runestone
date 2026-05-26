export const HOME_TEACHING_ICON_KEYS = {
	DOOR_OPEN: "door-open",
	LOCK: "lock",
	PACKAGE: "package",
	WORKFLOW: "workflow",
	ZAP: "zap",
} as const;

export type HomeTeachingIconKey =
	(typeof HOME_TEACHING_ICON_KEYS)[keyof typeof HOME_TEACHING_ICON_KEYS];
