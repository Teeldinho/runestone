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
		<div className={cn(MARKETING_LAYOUT_CLASS_NAMES.PAGE_FRAME, className)}>
			{children}
		</div>
	);
}
