import type { ReactNode } from "react";

type XStateInspectorDetailsPanelSectionProps = {
	children: ReactNode;
	className: string;
	id: string;
	title: string;
};

export function XStateInspectorDetailsPanelSection({
	children,
	className,
	id,
	title,
}: XStateInspectorDetailsPanelSectionProps) {
	return (
		<section aria-labelledby={id} className={className}>
			<h3
				id={id}
				className="text-[10px] uppercase tracking-widest text-muted-foreground"
			>
				{title}
			</h3>
			{children}
		</section>
	);
}
