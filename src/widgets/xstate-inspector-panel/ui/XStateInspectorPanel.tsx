import { Background, Controls, ReactFlow } from "@xyflow/react";

import type { MachineGraphSection } from "@/features/state-visualizer";
import {
	Badge,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	ScrollArea,
	Separator,
} from "@/shared/ui";

import "@xyflow/react/dist/style.css";

import { useXStateInspectorPanel } from "../model";

type XStateInspectorPanelProps = {
	activeStateLabel: string;
	sections: MachineGraphSection[];
};

export function XStateInspectorPanel({
	activeStateLabel,
	sections,
}: XStateInspectorPanelProps) {
	const inspectorPanel = useXStateInspectorPanel({
		activeStateLabel,
		sections,
	});

	return (
		<div className="flex h-full min-h-0 flex-col">
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
					Statechart Visualizer (XState)
				</h2>
				<Badge variant="outline" className="text-[10px]">
					{inspectorPanel.activeStateLabel}
				</Badge>
			</div>

			<ScrollArea className="min-h-0 flex-1">
				<div className="space-y-3 p-3">
					{inspectorPanel.sections.map((section) => (
						<Collapsible
							key={section.id}
							defaultOpen
							className="rounded border"
							style={{ borderColor: "var(--panel-border)" }}
						>
							<CollapsibleTrigger asChild>
								<button
									type="button"
									className="flex w-full min-w-0 items-center justify-between gap-2 px-3 py-2 text-left"
								>
									<span
										className="truncate text-xs font-semibold uppercase tracking-widest"
										style={{ color: "var(--foreground)" }}
									>
										{section.label}
									</span>
									<Badge
										variant="outline"
										className="max-w-[140px] truncate text-[10px]"
									>
										{section.activeStateLabel}
									</Badge>
								</button>
							</CollapsibleTrigger>

							<CollapsibleContent>
								<Separator />
								<div className="grid min-h-0 gap-0 md:grid-cols-[2fr_1fr]">
									<div
										className="min-h-[260px] border-b md:border-b-0 md:border-r"
										style={{ borderColor: "var(--panel-border)" }}
									>
										<ReactFlow
											colorMode="dark"
											edges={section.flowEdges}
											elementsSelectable={false}
											fitView
											fitViewOptions={{
												padding:
													inspectorPanel.reactFlowDefaults.FIT_VIEW_PADDING,
											}}
											maxZoom={inspectorPanel.reactFlowDefaults.MAX_ZOOM}
											minZoom={inspectorPanel.reactFlowDefaults.MIN_ZOOM}
											nodeOrigin={inspectorPanel.reactFlowDefaults.NODE_ORIGIN}
											nodes={section.flowNodes}
											nodesConnectable={false}
											nodesDraggable={false}
											proOptions={{ hideAttribution: true }}
											style={{ background: "var(--background)" }}
										>
											<Background
												gap={20}
												size={1}
												color="var(--panel-border)"
											/>
											<Controls
												position="bottom-right"
												showInteractive={false}
											/>
										</ReactFlow>
									</div>

									<div className="min-w-0 space-y-4 p-3">
										<section
											aria-labelledby={`${section.id}-states-heading`}
											className="space-y-2"
										>
											<h3
												id={`${section.id}-states-heading`}
												className="text-[10px] font-semibold uppercase tracking-widest"
												style={{ color: "var(--muted-foreground)" }}
											>
												States
											</h3>
											<ul className="space-y-1">
												{section.graphNodes.map((node) => (
													<li
														key={node.id}
														className="flex items-center justify-between rounded px-2 py-1.5 text-xs"
														style={{
															background: node.isActive
																? "color-mix(in srgb, var(--primary) 10%, transparent)"
																: "var(--background)",
															border: `1px solid ${node.isActive ? "var(--primary)" : "var(--panel-border)"}`,
														}}
													>
														<span style={{ color: "var(--foreground)" }}>
															{node.label}
														</span>
														{node.isActive ? (
															<span
																className="h-1.5 w-1.5 rounded-full"
																style={{ background: "var(--primary)" }}
															/>
														) : null}
													</li>
												))}
											</ul>
										</section>

										<Separator />

										<section
											aria-labelledby={`${section.id}-guards-heading`}
											className="space-y-2"
										>
											<h3
												id={`${section.id}-guards-heading`}
												className="text-[10px] font-semibold uppercase tracking-widest"
												style={{ color: "var(--muted-foreground)" }}
											>
												Guard Keys
											</h3>
											{section.guardKeys.length === 0 ? (
												<p
													className="text-[10px]"
													style={{ color: "var(--muted-foreground)" }}
												>
													No named guards
												</p>
											) : (
												<ul className="space-y-1">
													{section.guardKeys.map((guardKey) => (
														<li key={`${section.id}-guard-${guardKey}`}>
															<Badge variant="outline" className="text-[10px]">
																{guardKey}
															</Badge>
														</li>
													))}
												</ul>
											)}
										</section>

										<Separator />

										<section
											aria-labelledby={`${section.id}-transitions-heading`}
											className="space-y-2"
										>
											<h3
												id={`${section.id}-transitions-heading`}
												className="text-[10px] font-semibold uppercase tracking-widest"
												style={{ color: "var(--muted-foreground)" }}
											>
												Transitions
											</h3>
											<ul className="space-y-1">
												{section.graphEdges.map((edge) => (
													<li
														key={edge.id}
														className="flex flex-wrap items-center gap-1 rounded px-2 py-1.5 text-xs"
														style={{
															background: "var(--background)",
															border: "1px solid var(--panel-border)",
														}}
													>
														<span style={{ color: "var(--foreground)" }}>
															{edge.eventType}
														</span>
														<span style={{ color: "var(--muted-foreground)" }}>
															|
														</span>
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
								</div>
							</CollapsibleContent>
						</Collapsible>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
