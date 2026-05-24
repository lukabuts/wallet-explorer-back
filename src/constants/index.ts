export const SUPPORTED_CHAINS = ["ethereum", "polygon", "bnb"] as const;
export type ChainKey = (typeof SUPPORTED_CHAINS)[number];
