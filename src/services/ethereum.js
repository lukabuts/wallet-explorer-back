import { ethers } from "ethers";
import { getChain } from "./chains";
export const getBalance = async ({ address, chain, }) => {
    const balance = await getChain(chain).getBalance(address);
    return ethers.formatEther(balance);
};
export const getTransactions = async ({ address, chain, pageKey, }) => {
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
        transactions: data.transfers.map((tx) => ({
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
export const getTokens = async ({ address, chain, }) => {
    const ERC20_ABI = [
        "function balanceOf(address) view returns (uint256)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
        "function name() view returns (string)",
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
        ...new Set(data.transfers.map((tx) => tx.rawContract.address)),
    ].filter(Boolean);
    const tokens = await Promise.allSettled(contractAddresses.map(async (contractAddress) => {
        const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
        const [balance, symbol, decimals, name] = await Promise.all([
            contract.balanceOf(address),
            contract.symbol(),
            contract.decimals(),
            contract.name(),
        ]);
        return {
            contractAddress,
            symbol,
            balance: ethers.formatUnits(balance, decimals),
            name,
        };
    }));
    return tokens
        .filter((t) => t.status === "fulfilled")
        .map((t) => t.value)
        .filter((t) => parseFloat(t.balance) > 0);
};
