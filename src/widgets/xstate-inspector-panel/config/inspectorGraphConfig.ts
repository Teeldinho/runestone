export const INSPECTOR_EDGE_LABELS = {
	NO_GUARD: "No guard",
} as const;

export const INSPECTOR_COPY = {
	ACTIVE_LABEL: "Active",
	TRANSITION_LABEL_SINGULAR: "transition",
	TRANSITION_LABEL_PLURAL: "transitions",
	PANEL_TITLE: "Statechart Visualizer (XState)",
	GUARDS_HEADING: "Guards",
	EMPTY_GRAPH_MESSAGE: "No machine graph available.",
	DETAILS_PANEL_TITLE: "State Details",
	STATES_IN_MACHINE_LABEL: "States in this machine",
	GUARD_TOOLTIP_TITLE: "Guard",
	DIRECTION_PREFIX: "Direction:",
	TRANSITION_SUMMARY_MOVES_FROM: "moves from",
	TRANSITION_SUMMARY_TO: "to",
} as const;

export const INSPECTOR_ID_SEGMENT_SEPARATOR = ":";

export const INSPECTOR_ID_SEGMENTS = {
	INDICATOR: "indicator",
} as const;

export const INSPECTOR_FLOW_EDGE_VISUALS = {
	TYPE: "guard-marker",
} as const;

export const INSPECTOR_FLOW_EDGE_LAYOUT = {
	LANE_OFFSET_STEP: 18,
	GUARDED_EDGE_STROKE_COLOR: "var(--dungeon-gold)",
	GUARDED_EDGE_STROKE_DASHARRAY: "5 4",
	GUARDED_EDGE_STROKE_OPACITY: 0.55,
	UNGUARDED_EDGE_STROKE_COLOR: "var(--panel-border)",
	UNGUARDED_EDGE_STROKE_OPACITY: 0.32,
	GUARD_MARKER_COLORS: [
		"var(--dungeon-gold)",
		"var(--dungeon-rune)",
		"var(--dungeon-rune-open)",
		"var(--dungeon-rune-sealed)",
		"var(--panel-title)",
		"var(--dungeon-torch)",
	] as const,
	GUARD_MARKER_SIZE_PX: 14,
	GUARD_MARKER_HIT_AREA_PX: 22,
	GUARD_MARKER_GAP_PX: 24,
	GUARD_MARKER_LANE_SEPARATION_FACTOR: 1,
	GUARD_MARKER_DIRECTION_OFFSET_PX: 12,
	GUARD_MARKER_RING_COLOR: "var(--background)",
} as const;

export const INSPECTOR_FLOW_BACKGROUND = {
	GAP_PX: 20,
	SIZE_PX: 1,
} as const;

export const INSPECTOR_GUARD_LEGEND_LAYOUT = {
	DOT_SIZE_PX: 11,
} as const;

export const INSPECTOR_GUARD_MARKER_INTERACTION = {
	HOVER_OPEN_DELAY_MS: 80,
	HOVER_CLOSE_DELAY_MS: 60,
	DIRECTION_ARROW_OFFSET_EXTRA_PX: 4,
	POSITION_CENTER_PERCENT: "50%",
	TRANSLATE_CENTER: "translate(-50%, -50%)",
	DIRECTION_ARROW_BY_LABEL: {
		UP: "↑",
		DOWN: "↓",
	},
	DIRECTION_TEXT_BY_LABEL: {
		UP: "up",
		DOWN: "down",
	},
} as const;

export const INSPECTOR_FLOW_NODE_VISUALS = {
	BASE_CLASS_NAME:
		"rounded-md border text-xs font-semibold tracking-wide shadow-sm transition-colors",
	CLASS_NAME_BY_KIND: {
		initial: "border-cyan-300/80 bg-cyan-500/15 text-cyan-100",
		state: "border-slate-300/60 bg-slate-500/20 text-slate-100",
		final: "border-amber-300/80 bg-amber-500/15 text-amber-100",
	},
	ACTIVE_CLASS_NAME:
		"ring-2 ring-cyan-300/80 ring-offset-1 ring-offset-transparent",
} as const;

export const INSPECTOR_REACT_FLOW_DEFAULTS = {
	FIT_VIEW_PADDING: 0.16,
	MAX_ZOOM: 1.5,
	MIN_ZOOM: 0.45,
	NODE_ORIGIN: [0.5, 0.5] as [number, number],
} as const;

export const INSPECTOR_REACT_FLOW_SECTION_PADDING = {
	CAMERA: 0.24,
} as const;
