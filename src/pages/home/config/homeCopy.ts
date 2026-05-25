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

export const HOME_MANIFEST_TONE_CLASS_NAMES = {
	active: "text-dungeon-gold",
	available: "text-dungeon-gold",
	sealed: "text-dungeon-rune-sealed",
} as const;

export const HOME_MANIFEST_FOCUS_ITEM = {
	badge: "Guard Condition",
	detail:
		"Evaluates context before allowing passage. If the key is missing, the path stays blocked.",
	label: "Locked Door",
	tone: "sealed",
} as const;

export const HOME_MANIFEST_MAP_NODES = [
	{
		detail: "Initialize run",
		label: "Entrance",
		position: "top-[78px] left-[48px] w-[156px]",
		tone: "active",
	},
	{
		detail: "Transition",
		label: "Corridor",
		position: "top-[78px] left-[272px] w-[136px]",
		tone: "available",
	},
	{
		detail: "Guard condition",
		label: "Locked Door",
		position: "top-[78px] left-[502px] w-[160px]",
		tone: "sealed",
	},
	{
		detail: "Use context",
		label: "Inventory",
		position: "top-[218px] left-[252px] w-[160px]",
		tone: "available",
	},
] as const;

export const HOME_TRANSLATION_TONE_CLASS_NAMES = {
	accent: "text-panel-title",
	primary: "text-panel-title",
	sealed: "text-dungeon-rune-sealed",
} as const;

export const HOME_TRANSLATION_ARROW_CLASS_NAME = "text-dungeon-gold" as const;

export const HOME_TRANSLATION_RAIL = [
	{
		label: "State",
		target: "Room",
		tone: "primary",
	},
	{
		label: "Transition",
		target: "Corridor",
		tone: "primary",
	},
	{
		label: "Guard",
		target: "Locked Door",
		tone: "accent",
	},
	{
		label: "Context",
		target: "Inventory",
		tone: "primary",
	},
	{
		label: "Actor",
		target: "Loop",
		tone: "primary",
	},
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
		detail:
			"Each state becomes a distinct room with one clear point of occupancy.",
		title: "States become rooms",
		tone: "primary",
		span: "lg:col-span-2",
	},
	{
		detail: "Events are actions that open the next corridor when they resolve.",
		title: "Events move the system",
		tone: "accent",
		span: "lg:col-span-1",
	},
	{
		detail:
			"Guards stop traversal until the required state or inventory is present.",
		title: "Guards control progression",
		tone: "sealed",
		span: "lg:col-span-1",
	},
	{
		detail:
			"Actors run their own loops and stay isolated from the main machine.",
		title: "Actors stay isolated",
		tone: "primary",
		span: "lg:col-span-1",
	},
	{
		detail:
			"Inventory, HP, and current room data shape which paths remain valid.",
		title: "Context changes paths",
		tone: "primary",
		span: "lg:col-span-1",
	},
] as const;

export const HOME_TEACHING_TONE_CLASS_NAMES = {
	accent: "text-panel-title",
	primary: "text-panel-title",
	sealed: "text-dungeon-rune-sealed",
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
