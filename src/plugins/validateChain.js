import { SUPPORTED_CHAINS } from "@/constants";
export const validateChainHandler = async (request, reply) => {
    const { chain } = request.query;
    if (chain && !SUPPORTED_CHAINS.includes(chain)) {
        return reply.status(400).send({
            message: `Invalid chain. Supported: ${SUPPORTED_CHAINS.join(", ")}`,
        });
    }
};
