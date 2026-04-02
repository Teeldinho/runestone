import type {
	CHAIN_MULTIPLIERS,
	STORAGE_KEYS,
} from "@/shared/config/constants";

export type Vector3Tuple = readonly [number, number, number];

export type ChainMultiplierValue = (typeof CHAIN_MULTIPLIERS)[number];
export type StorageKeyValue = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
