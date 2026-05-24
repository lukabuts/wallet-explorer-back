import { ChainKey, SUPPORTED_CHAINS } from "@/constants";
import { FastifyReply, FastifyRequest } from "fastify";

export const validateChainHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { chain } = request.query as { chain?: ChainKey };
  if (chain && !SUPPORTED_CHAINS.includes(chain)) {
    return reply.status(400).send({
      message: `Invalid chain. Supported: ${SUPPORTED_CHAINS.join(", ")}`,
    });
  }
};
