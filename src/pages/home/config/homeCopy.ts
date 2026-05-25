export const HOME_COPY = {
	BADGE: "Playable architecture",
	CTA_LABEL: "Enter Dungeon",
	FEATURES_HEADING: "What the dungeon teaches",
	HEADING: "Walk through executable logic.",
	MANIFEST_PATH_HEADING: "Manifest Path",
	MANIFEST_PATH_SUBTITLE: "Follow the sequence. Decode the statechart.",
	MOBILE_ORIENTATION_NOTICE:
		"Landscape mode is recommended for gameplay and full logic visualization.",
	RUNTIME_HEADING: "Read the system while you play.",
	RUNTIME_SUBTITLE:
		"Gameplay, state, and context are shown together so the dungeon can be read as a running statechart.",
	SUBTITLE:
		"Runestone turns statecharts into a 3D dungeon: rooms are states, corridors are transitions, and every action is driven by explicit events.",
	TUTORIAL_LABEL: "Read the Guide",
} as const;

export const HOME_MANIFEST_TONE_CLASS_NAMES = {
	active: "border-primary/50 bg-primary/10 text-primary",
	available: "border-accent/50 bg-accent/10 text-accent",
	sealed:
		"border-dungeon-rune-sealed/50 bg-dungeon-rune-sealed/10 text-dungeon-rune-sealed",
} as const;

export const HOME_MANIFEST_PATH = [
	{
		detail: "Initialize run. Establish current room.",
		label: "Entrance",
		tone: "active",
	},
	{
		detail: "Move through a valid transition.",
		label: "Corridor",
		tone: "available",
	},
	{
		detail: "Guard condition blocks progress.",
		label: "Locked Door",
		tone: "sealed",
	},
	{
		detail: "Use context to unlock the path.",
		label: "Inventory Check",
		tone: "available",
	},
	{
		detail: "Camera, input, and dungeon logic process events independently.",
		label: "Actor Loops",
		tone: "active",
	},
] as const;

export const HOME_TRANSLATION_RAIL = [
	"State → Room",
	"Transition → Corridor",
	"Guard → Locked Door",
	"Context → Inventory",
	"Actor → Loop",
] as const;

export const HOME_RUNTIME_PANELS = [
	{
		detail: "The playable dungeon frame anchors the learning experience.",
		label: "Viewport",
	},
	{
		detail: "The active room maps to the current state.",
		label: "Statechart",
	},
	{
		detail: "Context explains why paths open or remain locked.",
		label: "Inspector",
	},
] as const;

export const HOME_FEATURES = [
	{
		detail: "Each chamber shows where the system currently is.",
		title: "States become rooms",
	},
	{
		detail: "Input, prompts, and combat dispatch explicit events.",
		title: "Events move the system",
	},
	{
		detail: "Doors open only when context satisfies the transition rule.",
		title: "Guards control progression",
	},
	{
		detail:
			"Camera, player, input, audio, and dungeon logic run through focused loops.",
		title: "Actors stay isolated",
	},
	{
		detail: "Keys, HP, and current room data shape what can happen next.",
		title: "Context changes valid paths",
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
