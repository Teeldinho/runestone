export const INSPECTOR_EDGE_LABELS = {
	NO_GUARD: "No guard",
} as const;

export const INSPECTOR_COPY = {
	ACTIVE_LABEL: "Active",
} as const;

export const INSPECTOR_FLOW_EDGE_VISUALS = {
	TYPE: "guard-marker",
} as const;

export const INSPECTOR_FLOW_EDGE_LAYOUT = {
	LANE_OFFSET_STEP: 18,
	GUARDED_EDGE_STROKE_COLOR: "var(--dungeon-gold)",
	GUARDED_EDGE_STROKE_DASHARRAY: "5 4",
	UNGUARDED_EDGE_STROKE_COLOR: "var(--panel-border)",
	GUARD_MARKER_COLORS: [
		"#f59e0b",
		"#22d3ee",
		"#34d399",
		"#f472b6",
		"#a78bfa",
		"#fb7185",
	] as const,
	GUARD_MARKER_SIZE_PX: 14,
	GUARD_MARKER_HIT_AREA_PX: 22,
	GUARD_MARKER_GAP_PX: 24,
	GUARD_MARKER_LANE_SEPARATION_FACTOR: 1,
	GUARD_MARKER_DIRECTION_OFFSET_PX: 12,
	GUARD_MARKER_RING_COLOR: "var(--background)",
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
