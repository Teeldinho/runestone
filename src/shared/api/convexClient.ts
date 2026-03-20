import { ConvexReactClient } from "convex/react";

const LOCAL_CONVEX_URL = "http://127.0.0.1:3210";
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL ?? LOCAL_CONVEX_URL;

export const convexClient = new ConvexReactClient(CONVEX_URL);
