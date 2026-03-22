export const INSPECTOR_EDGE_LABELS = {
	NO_GUARD: "No guard",
} as const;

export const INSPECTOR_FLOW_EDGE_VISUALS = {
	TYPE: "smoothstep",
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
	NODE_ORIGIN: [0.5, 0.5] as const,
} as const;
