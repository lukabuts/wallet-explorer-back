import Fastify from "fastify";
import cors from "@fastify/cors";
import { walletRoutes } from "@/routes/wallet";

export const buildApp = async () => {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "HEAD"],
  });

  app.register(walletRoutes, { prefix: "/api/wallet" });
  app.get("/api/health", async (_, reply) => {
    return reply.send({ status: "ok" });
  });

  return app;
};
