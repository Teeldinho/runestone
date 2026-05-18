export const INPUT_ACTION_KEYS = {
	ASSIGN_POINTER_OWNER: "input.action.assignPointerOwner",
	RELEASE_POINTER_OWNER: "input.action.releasePointerOwner",

	ASSIGN_MOVE_VECTOR: "input.action.assignMoveVector",
	CLEAR_MOVE_VECTOR: "input.action.clearMoveVector",

	SET_RUN_ENABLED: "input.action.setRunEnabled",
	SET_RUN_DISABLED: "input.action.setRunDisabled",

	SEND_PLAYER_MOVE: "input.action.sendPlayerMove",
	SEND_PLAYER_MOVE_WITH_RUN_ENABLED_FROM_CONTEXT:
		"input.action.sendPlayerMoveWithRunEnabledFromContext",
	SEND_PLAYER_MOVE_WITH_RUN_DISABLED_FROM_CONTEXT:
		"input.action.sendPlayerMoveWithRunDisabledFromContext",
	SEND_PLAYER_STOP: "input.action.sendPlayerStop",
	SEND_PLAYER_JUMP: "input.action.sendPlayerJump",

	SEND_INTERACT: "input.action.sendInteract",
	SEND_ATTACK: "input.action.sendAttack",
	SEND_FIRE: "input.action.sendFire",
} as const;

export type InputActionKey =
	(typeof INPUT_ACTION_KEYS)[keyof typeof INPUT_ACTION_KEYS];
