import type {
	HapticEventName,
	HapticPatternKey,
} from "@/features/haptics-feedback/config";

export type HapticEventMap = Record<HapticEventName, HapticPatternKey>;
