import type { ReactNode } from "react";

type AudioProviderProps = {
	children: ReactNode;
};

export function AudioProvider({ children }: AudioProviderProps) {
	return children;
}
