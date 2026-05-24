import { ethers } from "ethers";
import { FastifyReply, FastifyRequest } from "fastify";

export const validateAddressHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { address } = request.params as { address?: string };
  if (address && !ethers.isAddress(address)) {
    return reply.status(400).send({ message: "Invalid Ethereum address" });
  }
};
