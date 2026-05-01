export const HOME_COPY = {
	BADGE: "Dungeon briefing",
	CTA_LABEL: "Enter Dungeon",
	FEATURES_HEADING: "What you’ll learn",
	HEADING: "Runestone",
	SUBTITLE: "A living dungeon where rooms change as you move through them.",
	TUTORIAL_LABEL: "How to Play",
	SESSION_NOTE:
		"We’re getting your game ready. You can keep reading the guide while we sign you in.",
} as const;

export const HOME_FEATURES = [
	{
		detail: "Rooms and doors react as you move forward.",
		title: "The dungeon shifts as you progress.",
	},
	{
		detail:
			"Switch between third-person, top-down, first-person, and free-orbital views.",
		title: "Pick the view that feels easiest to play.",
	},
	{
		detail:
			"The guide covers movement, interaction, attack, and camera controls.",
		title: "Learn the basics before you descend.",
	},
] as const;

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
