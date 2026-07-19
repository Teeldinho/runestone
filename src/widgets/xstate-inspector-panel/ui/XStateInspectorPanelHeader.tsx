import { Activity } from "lucide-react";

import { INSPECTOR_COPY } from "../config";

export function XStateInspectorPanelHeader() {
	return (
		<div className="hidden flex-wrap items-center justify-between gap-2 border-panel-border/60 border-b bg-background/25 px-4 py-3 lg:flex">
			<h2
				id="xstate-inspector-heading"
				className="font-mono text-xs font-semibold tracking-widest text-dungeon-gold uppercase"
			>
				{INSPECTOR_COPY.PANEL_TITLE}
			</h2>
			<span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-dungeon-rune uppercase">
				<Activity aria-hidden="true" className="size-3" />
				Live
			</span>
		</div>
	);
}
