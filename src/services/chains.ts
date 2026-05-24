import { ethers } from "ethers";
import { ChainKey } from "@/constants";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

if (!ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY is not set in environment variables");
}

const CHAINS: Record<ChainKey, ethers.JsonRpcProvider> = {
  ethereum: new ethers.JsonRpcProvider(
    `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  ),
  polygon: new ethers.JsonRpcProvider(
    `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  ),
  bnb: new ethers.JsonRpcProvider(
    `https://bnb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  ),
};

export const getChain = (provider?: ChainKey) => {
  return CHAINS[provider || "ethereum"];
};
