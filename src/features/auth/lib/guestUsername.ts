import { GUEST_USERNAME_CONFIG } from "../config";
import { isUsernameValid } from "./discriminator";

type GuestUsernameRandomIntegerFactory = (maxExclusive: number) => number;

const getCryptoRandomInteger = (maxExclusive: number): number => {
	if (maxExclusive <= 0) {
		return 0;
	}

	if (globalThis.crypto?.getRandomValues) {
		const [randomValue] = globalThis.crypto.getRandomValues(new Uint32Array(1));

		return randomValue % maxExclusive;
	}

	return Math.floor(Math.random() * maxExclusive);
};

const getRandomItem = <Item>(
	items: readonly Item[],
	randomInteger: GuestUsernameRandomIntegerFactory,
): Item => {
	const index = randomInteger(items.length);

	return items[index] ?? items[0];
};

const createRandomSuffix = (
	randomInteger: GuestUsernameRandomIntegerFactory,
): string => {
	const fallbackCharacter = GUEST_USERNAME_CONFIG.RANDOM_ALPHABET[0];

	return Array.from(
		{ length: GUEST_USERNAME_CONFIG.RANDOM_SUFFIX_LENGTH },
		() =>
			GUEST_USERNAME_CONFIG.RANDOM_ALPHABET[
				randomInteger(GUEST_USERNAME_CONFIG.RANDOM_ALPHABET.length)
			] ?? fallbackCharacter,
	).join("");
};

const createFallbackUsername = (): string => {
	const [fallbackAdjective] = GUEST_USERNAME_CONFIG.ADJECTIVES;
	const [fallbackNoun] = GUEST_USERNAME_CONFIG.NOUNS;
	const fallbackSuffix = GUEST_USERNAME_CONFIG.RANDOM_ALPHABET[0].repeat(
		GUEST_USERNAME_CONFIG.RANDOM_SUFFIX_LENGTH,
	);

	return [
		GUEST_USERNAME_CONFIG.PREFIX,
		`${fallbackAdjective}${fallbackNoun}${fallbackSuffix}`,
	].join(GUEST_USERNAME_CONFIG.SEPARATOR);
};

export const createSuggestedUsername = (
	randomInteger: GuestUsernameRandomIntegerFactory = getCryptoRandomInteger,
): string => {
	const adjective = getRandomItem(
		GUEST_USERNAME_CONFIG.ADJECTIVES,
		randomInteger,
	);
	const noun = getRandomItem(GUEST_USERNAME_CONFIG.NOUNS, randomInteger);
	const suffix = createRandomSuffix(randomInteger);

	const username = [
		GUEST_USERNAME_CONFIG.PREFIX,
		`${adjective}${noun}${suffix}`,
	].join(GUEST_USERNAME_CONFIG.SEPARATOR);

	return isUsernameValid(username) ? username : createFallbackUsername();
};

export type { GuestUsernameRandomIntegerFactory };
