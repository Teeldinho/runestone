import type { ReactNode } from "react";

type ConvexProviderProps = {
	children: ReactNode;
};

export function ConvexProvider({ children }: ConvexProviderProps) {
	return children;
}
