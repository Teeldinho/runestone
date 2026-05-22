export const GUEST_USERNAME_CONFIG = {
	PREFIX: "Rune",
	SEPARATOR: "_",
	RANDOM_SUFFIX_LENGTH: 4,
	RANDOM_ALPHABET: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
	ADJECTIVES: [
		"Ash",
		"Dusk",
		"Ember",
		"Frost",
		"Gold",
		"Iron",
		"Mist",
		"Onyx",
		"Storm",
	] as const,
	NOUNS: ["Bear", "Fox", "Hawk", "Lion", "Raven", "Wisp", "Wolf"] as const,
} as const;
