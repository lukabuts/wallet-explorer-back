import { FastifyInstance } from "fastify";
import { getBalance, getTransactions, getTokens, getCached } from "@/services";
import { validateAddressHandler, validateChainHandler } from "@/plugins";
import { ChainKey } from "@/constants";

export const walletRoutes = async (app: FastifyInstance) => {
  app.get<{
    Params: { address: string };
    Querystring: { chain?: ChainKey };
  }>(
    "/:address/balance",
    { preHandler: [validateAddressHandler, validateChainHandler] },
    async (request, reply) => {
      const { address } = request.params;
      const { chain } = request.query;
      const balance = await getCached(
        `balance:${address}:${chain || "ethereum"}`,
        () => getBalance({ address, chain }),
      );
      return reply.send({ address, balance });
    },
  );

  app.get<{
    Params: { address: string };
    Querystring: { pageKey?: string; chain?: ChainKey };
  }>(
    "/:address/transactions",
    { preHandler: [validateAddressHandler, validateChainHandler] },
    async (request, reply) => {
      const { address } = request.params;
      const { pageKey, chain } = request.query;
      const result = await getCached(
        `txs:${address}:${pageKey || "first"}:${chain || "ethereum"}`,
        () => getTransactions({ address, pageKey, chain }),
      );
      return reply.send({ address, ...result });
    },
  );

  app.get<{
    Params: { address: string };
    Querystring: { chain?: ChainKey };
  }>(
    "/:address/tokens",
    { preHandler: [validateAddressHandler, validateChainHandler] },
    async (request, reply) => {
      const { address } = request.params;
      const { chain } = request.query;
      const tokens = await getCached(
        `tokens:${address}:${chain || "ethereum"}`,
        () => getTokens({ address, chain }),
      );
      return reply.send({ address, tokens });
    },
  );
};
