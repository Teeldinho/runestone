import { INPUT_EVENT_TYPES, INPUT_KEYBOARD_CODES } from "../config";

type KeyboardInputPhase =
	| typeof INPUT_EVENT_TYPES.KEY_DOWN
	| typeof INPUT_EVENT_TYPES.KEY_UP;

type ResolveKeyboardInputEventInput = {
	readonly code: string;
	readonly phase: KeyboardInputPhase;
};

export type ResolvedKeyboardInputEvent =
	| {
			readonly type: typeof INPUT_EVENT_TYPES.RUN_TOGGLED;
	  }
	| { readonly type: typeof INPUT_EVENT_TYPES.JUMP_PRESSED }
	| { readonly type: typeof INPUT_EVENT_TYPES.INTERACT_PRESSED }
	| { readonly type: typeof INPUT_EVENT_TYPES.ATTACK_PRESSED }
	| undefined;

export const resolveKeyboardInputEvent = ({
	code,
	phase,
}: ResolveKeyboardInputEventInput): ResolvedKeyboardInputEvent => {
	const isKeyDown = phase === INPUT_EVENT_TYPES.KEY_DOWN;

	if (
		code === INPUT_KEYBOARD_CODES.SHIFT_LEFT ||
		code === INPUT_KEYBOARD_CODES.SHIFT_RIGHT
	) {
		return isKeyDown ? { type: INPUT_EVENT_TYPES.RUN_TOGGLED } : undefined;
	}

	if (!isKeyDown) {
		return undefined;
	}

	if (code === INPUT_KEYBOARD_CODES.SPACE) {
		return { type: INPUT_EVENT_TYPES.JUMP_PRESSED };
	}

	if (code === INPUT_KEYBOARD_CODES.KEY_E) {
		return { type: INPUT_EVENT_TYPES.INTERACT_PRESSED };
	}

	if (code === INPUT_KEYBOARD_CODES.KEY_F) {
		return { type: INPUT_EVENT_TYPES.ATTACK_PRESSED };
	}

	return undefined;
};
