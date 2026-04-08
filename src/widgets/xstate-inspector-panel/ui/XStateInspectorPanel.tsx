import { Background, Controls, ReactFlow } from "@xyflow/react";

import type { MachineGraphSection } from "@/features/state-visualizer";
import { Badge, Tabs, TabsList, TabsTrigger } from "@/shared/ui";

import "@xyflow/react/dist/style.css";

import { useXStateInspectorPanel } from "../model";

type XStateInspectorPanelProps = {
	sections: MachineGraphSection[];
};

export function XStateInspectorPanel({ sections }: XStateInspectorPanelProps) {
	const inspectorPanel = useXStateInspectorPanel({ sections });

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div
				className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3"
				style={{ borderColor: "var(--panel-border)" }}
			>
				<h2
					id="xstate-inspector-heading"
					className="text-xs font-semibold uppercase tracking-widest"
					style={{
						color: "var(--dungeon-gold)",
						fontFamily: "Space Grotesk, sans-serif",
					}}
				>
					Statechart Visualizer (XState)
				</h2>
				{inspectorPanel.selectedSection ? (
					<Badge variant="outline" className="text-[10px]">
						{inspectorPanel.selectedSection.activeStateLabel}
					</Badge>
				) : null}
			</div>

			<div
				className="border-b px-4 py-2"
				style={{ borderColor: "var(--panel-border)" }}
			>
				<Tabs
					value={inspectorPanel.selectedSectionId}
					onValueChange={inspectorPanel.handleSelectedSectionIdChange}
				>
					<TabsList className="grid h-auto w-full grid-cols-4 gap-1 p-1">
						{inspectorPanel.sectionTabs.map((sectionTab) => (
							<TabsTrigger
								key={sectionTab.id}
								value={sectionTab.id}
								className="h-7 text-[10px]"
							>
								{sectionTab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			<div className="min-h-0 flex-1 p-3">
				{inspectorPanel.selectedSection ? (
					<ReactFlow
						colorMode="dark"
						edges={inspectorPanel.selectedSection.flowEdges}
						elementsSelectable={false}
						fitView
						fitViewOptions={{
							padding: inspectorPanel.reactFlowDefaults.FIT_VIEW_PADDING,
						}}
						maxZoom={inspectorPanel.reactFlowDefaults.MAX_ZOOM}
						minZoom={inspectorPanel.reactFlowDefaults.MIN_ZOOM}
						nodeOrigin={inspectorPanel.reactFlowDefaults.NODE_ORIGIN}
						nodes={inspectorPanel.selectedSection.flowNodes}
						nodesConnectable={false}
						nodesDraggable={false}
						proOptions={{ hideAttribution: true }}
						style={{ background: "var(--background)" }}
					>
						<Background gap={20} size={1} color="var(--panel-border)" />
						<Controls position="bottom-right" showInteractive={false} />
					</ReactFlow>
				) : (
					<div
						className="flex h-full items-center justify-center rounded border text-xs"
						style={{
							borderColor: "var(--panel-border)",
							color: "var(--muted-foreground)",
						}}
					>
						No machine graph available.
					</div>
				)}
			</div>
		</div>
	);
}
