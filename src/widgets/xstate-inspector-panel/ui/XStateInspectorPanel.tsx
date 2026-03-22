import { Background, Controls, ReactFlow } from "@xyflow/react";
import type {
	MachineGraphEdge,
	PositionedMachineGraphNode,
} from "@/features/state-visualizer";
import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Separator,
} from "@/shared/ui";

import "@xyflow/react/dist/style.css";

import { INSPECTOR_COPY } from "../config";
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
		<Card className="border-border bg-background/70">
			<CardHeader>
				<CardTitle id="xstate-inspector-heading" className="text-base">
					XState Inspector
				</CardTitle>
				<CardDescription>
					Live machine graph metadata derived from the active dungeon context.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-5">
				<section
					aria-labelledby="inspector-graph-heading"
					className="space-y-2"
				>
					<h3
						id="inspector-graph-heading"
						className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
					>
						Graph Runtime
					</h3>
					<div className="h-80 overflow-hidden rounded-md border border-border/60 bg-muted/20">
						<ReactFlow
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
						>
							<Background gap={20} size={1} />
							<Controls position="bottom-right" showInteractive={false} />
						</ReactFlow>
					</div>
				</section>

				<Separator />

				<section
					aria-labelledby="inspector-active-state-heading"
					className="space-y-2"
				>
					<h3
						id="inspector-active-state-heading"
						className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
					>
						Current State
					</h3>
					<Badge>{inspectorPanel.activeStateLabel}</Badge>
				</section>

				<Separator />

				<section
					aria-labelledby="inspector-nodes-heading"
					className="space-y-2"
				>
					<h3
						id="inspector-nodes-heading"
						className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
					>
						Graph Nodes
					</h3>
					<ul className="grid gap-2 md:grid-cols-2">
						{inspectorPanel.graphNodes.map((node) => (
							<li
								key={node.id}
								className="flex items-center justify-between rounded-md border border-border/60 bg-muted/30 px-3 py-2"
							>
								<span className="font-medium text-foreground">
									{node.label}
								</span>
								<div className="flex items-center gap-2">
									<Badge variant="outline">{node.kind}</Badge>
									{node.isActive ? (
										<Badge>{INSPECTOR_COPY.ACTIVE_LABEL}</Badge>
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
						className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
					>
						Transitions
					</h3>
					<ul className="space-y-2 text-sm">
						{inspectorPanel.graphEdges.map((edge) => (
							<li
								key={edge.id}
								className="flex flex-wrap items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2"
							>
								<span className="font-medium text-foreground">
									{edge.source}
								</span>
								<span aria-hidden="true" className="text-muted-foreground">
									→
								</span>
								<span className="font-medium text-foreground">
									{edge.target}
								</span>
								{edge.guard ? (
									<Badge variant="secondary">{edge.guard}</Badge>
								) : (
									<Badge variant="outline">No guard</Badge>
								)}
							</li>
						))}
					</ul>
				</section>
			</CardContent>
		</Card>
	);
}
