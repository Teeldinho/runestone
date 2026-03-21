import { AUTH_STORAGE_KEYS } from "../config";

type StorageAdapter = Pick<Storage, "getItem" | "setItem" | "removeItem">;

type SessionUuidFactory = () => string;

export const readSessionUuid = (storage: StorageAdapter): string | null =>
	storage.getItem(AUTH_STORAGE_KEYS.SESSION_UUID);

export const readPersistedUsername = (storage: StorageAdapter): string | null =>
	storage.getItem(AUTH_STORAGE_KEYS.USERNAME);

const writeSessionUuid = (storage: StorageAdapter, uuid: string): void => {
	storage.setItem(AUTH_STORAGE_KEYS.SESSION_UUID, uuid);
};

export const writePersistedUsername = (
	storage: StorageAdapter,
	username: string,
): void => {
	storage.setItem(AUTH_STORAGE_KEYS.USERNAME, username);
};

export const clearPersistedUsername = (storage: StorageAdapter): void => {
	storage.removeItem(AUTH_STORAGE_KEYS.USERNAME);
};

export const ensureSessionUuid = (
	storage: StorageAdapter,
	createUuid: SessionUuidFactory,
): string => {
	const existingUuid = readSessionUuid(storage);

	if (existingUuid) {
		return existingUuid;
	}

	const generatedUuid = createUuid();
	writeSessionUuid(storage, generatedUuid);

	return generatedUuid;
};

export const hasPersistedAuthSession = (storage: StorageAdapter): boolean =>
	Boolean(readSessionUuid(storage) && readPersistedUsername(storage));

export type { SessionUuidFactory, StorageAdapter };
