import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

import { MARKETING_LAYOUT_CLASS_NAMES } from "../config";

type MarketingPageFrameProps = {
	children: ReactNode;
	className?: string;
};

export function MarketingPageFrame({
	children,
	className,
}: MarketingPageFrameProps) {
	return (
		<div className={MARKETING_LAYOUT_CLASS_NAMES.CONTENT_GUTTER}>
			<div
				className={cn(
					"mx-auto",
					MARKETING_LAYOUT_CLASS_NAMES.CONTENT_WIDTH,
					MARKETING_LAYOUT_CLASS_NAMES.PAGE_FRAME,
					className,
				)}
			>
				{children}
			</div>
		</div>
	);
}
