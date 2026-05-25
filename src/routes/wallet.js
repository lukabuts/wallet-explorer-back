import { getBalance, getTransactions, getTokens, getCached } from "@/services";
import { validateAddressHandler, validateChainHandler } from "@/plugins";
export const walletRoutes = async (app) => {
    app.get("/:address/balance", { preHandler: [validateAddressHandler, validateChainHandler] }, async (request, reply) => {
        const { address } = request.params;
        const { chain } = request.query;
        const balance = await getCached(`balance:${address}:${chain || "ethereum"}`, () => getBalance({ address, chain }));
        return reply.send({ address, balance });
    });
    app.get("/:address/transactions", { preHandler: [validateAddressHandler, validateChainHandler] }, async (request, reply) => {
        const { address } = request.params;
        const { pageKey, chain } = request.query;
        const result = await getCached(`txs:${address}:${pageKey || "first"}:${chain || "ethereum"}`, () => getTransactions({ address, pageKey, chain }));
        return reply.send({ address, ...result });
    });
    app.get("/:address/tokens", { preHandler: [validateAddressHandler, validateChainHandler] }, async (request, reply) => {
        const { address } = request.params;
        const { chain } = request.query;
        const tokens = await getCached(`tokens:${address}:${chain || "ethereum"}`, () => getTokens({ address, chain }));
        return reply.send({ address, tokens });
    });
};
