export const HOME_COPY = {
	BADGE: "Playable architecture",
	CTA_LABEL: "Enter Dungeon",
	FEATURES_HEADING: "What the dungeon teaches",
	HEADING: "Walk through executable logic.",
	MANIFEST_PATH_HEADING: "Manifest Map",
	MANIFEST_PATH_SUBTITLE:
		"Watch the current run resolve into rooms, corridors, guards, and context.",
	MOBILE_ORIENTATION_NOTICE:
		"Landscape mode is recommended for gameplay and full logic visualization.",
	RUNTIME_HEADING: "Read the system while you play.",
	RUNTIME_SUBTITLE:
		"Gameplay, state, and context are shown together so the dungeon can be read as a running statechart.",
	SUBTITLE:
		"Runestone turns statecharts into a 3D dungeon: rooms are states, corridors are transitions, and every action is driven by explicit events.",
	TUTORIAL_LABEL: "Read the Guide",
} as const;

export const HOME_STATUS_COPY = {
	CHECKING_SESSION: {
		badge: "Getting ready",
		description: "We’re checking your session and loading your profile.",
		detail: "You can keep reading while the gate is being prepared.",
		iconLabel: "Loading",
		title: "Preparing your run",
	},
	BOOTSTRAP_FAILED: {
		badge: "Session unavailable",
		description: "Try again in a moment.",
		detail: "The dungeon is still here once the backend is reachable.",
		actionLabel: "Try again",
		iconLabel: "Unavailable",
		title: "We couldn’t load your profile",
	},
	REQUIRES_USERNAME: {
		badge: "Choose a name",
		description: "This name will be used to save your progress.",
		detail: "The dungeon stays sealed until your name is set.",
		iconLabel: "Choose a name",
		title: "Pick a rune name to begin",
	},
	SUBMITTING_USERNAME: {
		badge: "Saving name",
		description: "We’re writing your profile now.",
		detail: "Keep going, the gate will open as soon as it’s ready.",
		iconLabel: "Summoning",
		title: "Saving your name...",
	},
	AUTHENTICATED: {
		badge: "Ready",
		description: "Your profile is ready and you can enter now.",
		detail: "Use the blue primary button to enter the dungeon.",
		iconLabel: "Ready",
		title: "The gate is open",
	},
} as const;
