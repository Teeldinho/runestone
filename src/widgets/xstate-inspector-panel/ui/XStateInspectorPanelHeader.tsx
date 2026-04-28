import { INSPECTOR_COPY } from "../config";

export function XStateInspectorPanelHeader() {
	return (
		<div className="hidden flex-wrap items-center justify-between gap-2 border-b border-panel-border/50 px-3 py-1.5 lg:flex lg:px-4 lg:py-3">
			<h2
				id="xstate-inspector-heading"
				className="text-xs font-semibold uppercase tracking-widest text-dungeon-gold"
			>
				{INSPECTOR_COPY.PANEL_TITLE}
			</h2>
		</div>
	);
}
