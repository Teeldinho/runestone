import { ConvexReactClient } from "convex/react";

import { CONVEX_LOCAL_URL } from "@/shared/config";

const convexUrl = import.meta.env.VITE_CONVEX_URL ?? CONVEX_LOCAL_URL;

export const convexClient = new ConvexReactClient(convexUrl);
