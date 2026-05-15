import {
	INPUT_POINTER_DATA_ATTRIBUTE_VALUES,
	INPUT_POINTER_DATA_ATTRIBUTES,
} from "../config/pointerInteractionConfig";

type ShouldBlockLookFromPointerTargetInput = {
	readonly target: EventTarget | null;
};

export const shouldBlockLookFromPointerTarget = ({
	target,
}: ShouldBlockLookFromPointerTargetInput): boolean => {
	if (!(target instanceof HTMLElement)) {
		return false;
	}

	return (
		target.closest(
			`[${INPUT_POINTER_DATA_ATTRIBUTES.BLOCKS_LOOK}="${INPUT_POINTER_DATA_ATTRIBUTE_VALUES.TRUE}"]`,
		) !== null
	);
};
