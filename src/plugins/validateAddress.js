import { ethers } from "ethers";
export const validateAddressHandler = async (request, reply) => {
    const { address } = request.params;
    if (address && !ethers.isAddress(address)) {
        return reply.status(400).send({ message: "Invalid Ethereum address" });
    }
};
