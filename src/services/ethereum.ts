import { ethers } from "ethers";
import { getChain } from "./getChain";
import { ChainKey } from "@/constants";

export const getBalance = async ({
  address,
  chain,
}: {
  address: string;
  chain?: ChainKey;
}) => {
  const balance = await getChain(chain).getBalance(address);
  return ethers.formatEther(balance);
};

export const getTransactions = async ({
  address,
  chain,
  pageKey,
}: {
  address: string;
  chain?: ChainKey;
  pageKey?: string;
}) => {
  const provider = getChain(chain);
  const data = await provider.send("alchemy_getAssetTransfers", [
    {
      fromAddress: address,
      category: ["external", "internal", "erc20"],
      maxCount: "0xa",
      order: "desc",
      withMetadata: false,
      ...(pageKey && { pageKey }),
    },
  ]);

  return {
    transactions: data.transfers.map((tx: any) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value?.toString() ?? "0",
      asset: tx.asset,
      blockNumber: tx.blockNum,
    })),
    nextPageKey: data.pageKey ?? null,
  };
};

export const getTokens = async ({
  address,
  chain,
}: {
  address: string;
  chain?: ChainKey;
}) => {
  const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
  ];

  const provider = getChain(chain);
  const data = await provider.send("alchemy_getAssetTransfers", [
    {
      toAddress: address,
      category: ["erc20"],
      maxCount: "0x32",
      order: "desc",
      withMetadata: false,
    },
  ]);

  // get unique contract addresses
  const contractAddresses = [
    ...new Set(data.transfers.map((tx: any) => tx.rawContract.address)),
  ].filter(Boolean);

  const tokens = await Promise.allSettled(
    contractAddresses.map(async (contractAddress: any) => {
      const contract = new ethers.Contract(
        contractAddress,
        ERC20_ABI,
        provider,
      );
      const [balance, symbol, decimals] = await Promise.all([
        contract.balanceOf(address),
        contract.symbol(),
        contract.decimals(),
      ]);
      return {
        contract: contractAddress,
        symbol,
        balance: ethers.formatUnits(balance, decimals),
      };
    }),
  );

  return tokens
    .filter((t) => t.status === "fulfilled")
    .map((t) => (t as PromiseFulfilledResult<any>).value)
    .filter((t) => parseFloat(t.balance) > 0);
};
