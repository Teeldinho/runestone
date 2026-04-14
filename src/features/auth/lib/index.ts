export { checkHasProfile } from "./authMachineGuards";
export {
	formatUserDisplayTag,
	isUsernameValid,
	normalizeUsernameInput,
} from "./discriminator";
export type { SessionUuidFactory, StorageAdapter } from "./sessionStorage";
export {
	clearPersistedUsername,
	ensureSessionUuid,
	hasPersistedAuthSession,
	readPersistedUsername,
	readSessionUuid,
	writePersistedUsername,
} from "./sessionStorage";
export { USERNAME_PATTERN } from "./usernamePattern";
export { getUsernameValidationError } from "./usernameValidation";
