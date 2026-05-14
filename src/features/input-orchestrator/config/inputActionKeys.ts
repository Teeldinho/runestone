export const INPUT_ACTION_KEYS = {
	ASSIGN_POINTER_OWNER: "input.action.assignPointerOwner",
	RELEASE_POINTER_OWNER: "input.action.releasePointerOwner",

	ASSIGN_MOVE_VECTOR: "input.action.assignMoveVector",
	CLEAR_MOVE_VECTOR: "input.action.clearMoveVector",

	ASSIGN_LOOK_POINTER: "input.action.assignLookPointer",
	CLEAR_LOOK_POINTER: "input.action.clearLookPointer",
	ASSIGN_LOOK_DELTA: "input.action.assignLookDelta",
	CLEAR_LOOK_DELTA: "input.action.clearLookDelta",

	ASSIGN_ZOOM_DELTA: "input.action.assignZoomDelta",
	CLEAR_ZOOM_DELTA: "input.action.clearZoomDelta",

	ASSIGN_RUN_HELD: "input.action.assignRunHeld",
	SET_MOBILE_RUN_ENABLED: "input.action.setMobileRunEnabled",
	SET_MOBILE_RUN_DISABLED: "input.action.setMobileRunDisabled",

	SEND_PLAYER_MOVE: "input.action.sendPlayerMove",
	SEND_PLAYER_MOVE_WITH_RUN_ENABLED_FROM_CONTEXT:
		"input.action.sendPlayerMoveWithRunEnabledFromContext",
	SEND_PLAYER_MOVE_WITH_RUN_DISABLED_FROM_CONTEXT:
		"input.action.sendPlayerMoveWithRunDisabledFromContext",
	SEND_PLAYER_STOP: "input.action.sendPlayerStop",
	SEND_PLAYER_RUN_HELD: "input.action.sendPlayerRunHeld",
	SEND_PLAYER_JUMP: "input.action.sendPlayerJump",

	SEND_CAMERA_LOOK: "input.action.sendCameraLook",
	SEND_CAMERA_LOOK_STOP: "input.action.sendCameraLookStop",
	SEND_CAMERA_ZOOM: "input.action.sendCameraZoom",

	SEND_INTERACT: "input.action.sendInteract",
	SEND_ATTACK: "input.action.sendAttack",
	SEND_FIRE: "input.action.sendFire",
} as const;

export type InputActionKey =
	(typeof INPUT_ACTION_KEYS)[keyof typeof INPUT_ACTION_KEYS];
