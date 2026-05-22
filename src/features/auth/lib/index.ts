export { checkHasProfile } from "./authMachineGuards";
export {
	getAuthClientStorage,
	resolveAuthSubmitErrorMessage,
	resolveSessionBootstrapErrorMessage,
	resolveSessionBootstrapEvent,
	resolveSessionBootstrapFailureEvent,
	type SessionBootstrapEvent,
	type SessionBootstrapFailureEvent,
	type SessionBootstrapFailureInput,
	type SessionBootstrapInput,
	type SubmitAuthUsernameEvent,
	type SubmitAuthUsernameInput,
	submitAuthUsername,
} from "./authSessionOrchestration";
export {
	type AuthSnapshotLike,
	type CreateAuthContextValueInput,
	createAuthContextValue,
} from "./createAuthContextValue";
export {
	formatUserDisplayTag,
	isUsernameValid,
	normalizeUsernameInput,
} from "./discriminator";
export {
	createSuggestedUsername,
	type GuestUsernameRandomIntegerFactory,
} from "./guestUsername";
export type { SessionUuidFactory, StorageAdapter } from "./sessionStorage";
export {
	clearPersistedUsername,
	ensureSessionUuid,
	hasPersistedAuthSession,
	readPersistedUsername,
	readSessionUuid,
	writePersistedUsername,
} from "./sessionStorage";
export { getUsernameValidationError } from "./usernameValidation";
