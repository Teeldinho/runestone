import { Background, Controls, ReactFlow } from "@xyflow/react";
import type {
	MachineGraphEdge,
	PositionedMachineGraphNode,
} from "@/features/state-visualizer";
import { Badge, ScrollArea, Separator } from "@/shared/ui";

import "@xyflow/react/dist/style.css";

import { useXStateInspectorPanel } from "../model";

type XStateInspectorPanelProps = {
	activeStateLabel: string;
	graphNodes: PositionedMachineGraphNode[];
	graphEdges: MachineGraphEdge[];
};

export function XStateInspectorPanel({
	activeStateLabel,
	graphNodes,
	graphEdges,
}: XStateInspectorPanelProps) {
	const inspectorPanel = useXStateInspectorPanel({
		activeStateLabel,
		graphEdges,
		graphNodes,
	});

	return (
		<div className="flex h-full flex-col">
			<div
				className="flex items-center justify-between border-b px-4 py-2"
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
					XState Inspector
				</h2>
				<Badge variant="outline" className="text-[10px]">
					{inspectorPanel.activeStateLabel}
				</Badge>
			</div>

			<div className="flex min-h-0 flex-1">
				{/* Graph area */}
				<div
					className="min-h-0 flex-[2] border-r"
					style={{ borderColor: "var(--panel-border)" }}
				>
					<ReactFlow
						colorMode="dark"
						edges={inspectorPanel.flowEdges}
						elementsSelectable={false}
						fitView
						fitViewOptions={{
							padding: inspectorPanel.reactFlowDefaults.FIT_VIEW_PADDING,
						}}
						maxZoom={inspectorPanel.reactFlowDefaults.MAX_ZOOM}
						minZoom={inspectorPanel.reactFlowDefaults.MIN_ZOOM}
						nodeOrigin={inspectorPanel.reactFlowDefaults.NODE_ORIGIN}
						nodes={inspectorPanel.flowNodes}
						nodesConnectable={false}
						nodesDraggable={false}
						proOptions={{ hideAttribution: true }}
						style={{ background: "var(--background)" }}
					>
						<Background gap={20} size={1} color="var(--panel-border)" />
						<Controls position="bottom-right" showInteractive={false} />
					</ReactFlow>
				</div>

				{/* Metadata panel */}
				<div className="min-w-0 flex-1">
					<ScrollArea className="h-full">
						<div className="space-y-4 p-3">
							<section
								aria-labelledby="inspector-nodes-heading"
								className="space-y-2"
							>
								<h3
									id="inspector-nodes-heading"
									className="text-[10px] font-semibold uppercase tracking-widest"
									style={{ color: "var(--muted-foreground)" }}
								>
									States
								</h3>
								<ul className="space-y-1">
									{inspectorPanel.graphNodes.map((node) => (
										<li
											key={node.id}
											className="flex items-center justify-between rounded px-2 py-1.5 text-xs"
											style={{
												background: node.isActive
													? "rgba(0, 215, 255, 0.1)"
													: "var(--background)",
												border: `1px solid ${node.isActive ? "var(--primary)" : "var(--panel-border)"}`,
											}}
										>
											<span style={{ color: "var(--foreground)" }}>
												{node.label}
											</span>
											<div className="flex items-center gap-1">
												{node.isActive ? (
													<span
														className="h-1.5 w-1.5 rounded-full"
														style={{ background: "var(--primary)" }}
													/>
												) : null}
											</div>
										</li>
									))}
								</ul>
							</section>

							<Separator />

							<section
								aria-labelledby="inspector-edges-heading"
								className="space-y-2"
							>
								<h3
									id="inspector-edges-heading"
									className="text-[10px] font-semibold uppercase tracking-widest"
									style={{ color: "var(--muted-foreground)" }}
								>
									Transitions
								</h3>
								<ul className="space-y-1">
									{inspectorPanel.graphEdges.map((edge) => (
										<li
											key={edge.id}
											className="flex flex-wrap items-center gap-1 rounded px-2 py-1.5 text-xs"
											style={{
												background: "var(--background)",
												border: "1px solid var(--panel-border)",
											}}
										>
											<span style={{ color: "var(--foreground)" }}>
												{edge.source}
											</span>
											<span style={{ color: "var(--muted-foreground)" }}>
												→
											</span>
											<span style={{ color: "var(--foreground)" }}>
												{edge.target}
											</span>
											{edge.guard ? (
												<span
													className="rounded px-1 py-0.5 text-[9px]"
													style={{
														background: "var(--destructive)",
														color: "var(--base-black)",
													}}
												>
													{edge.guard}
												</span>
											) : null}
										</li>
									))}
								</ul>
							</section>
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
